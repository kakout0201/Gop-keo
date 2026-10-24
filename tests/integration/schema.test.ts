import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { connectLocalDb, createTrip, deleteTrip, type Sql, type TripFixture } from "./helpers/db";

const TABLES = [
  "devices",
  "trips",
  "members",
  "member_devices",
  "date_options",
  "place_options",
  "date_votes",
  "place_votes",
  "expenses",
  "expense_shares",
  "payout_accounts",
  "payments",
  "trip_events",
  "member_reads",
  "rate_limit_hits",
];

let sql: Sql;
let trip: TripFixture;

beforeAll(async () => {
  sql = connectLocalDb();
  trip = await createTrip(sql, ["Hùng", "Linh"]);
});

afterAll(async () => {
  await deleteTrip(sql, trip);
  await sql.end();
});

describe("I-13 ràng buộc schema", () => {
  const [hung, linh] = [() => trip.memberIds[0], () => trip.memberIds[1]];

  async function insertExpense(tx: Sql | postgres.TransactionSql, amount: number) {
    const id = randomUUID();
    await tx`
      insert into expenses (id, trip_id, title, amount_vnd, payer_member_id, created_by_member_id, updated_by_member_id)
      values (${id}, ${trip.tripId}, 'Bia', ${amount}, ${hung()}, ${hung()}, ${hung()})`;
    return id;
  }

  it("chấp nhận khoản chi có tổng phần chia đúng bằng số tiền", async () => {
    await sql.begin(async (tx) => {
      const id = await insertExpense(tx, 600_000);
      await tx`insert into expense_shares (trip_id, expense_id, member_id, amount_vnd)
               values (${trip.tripId}, ${id}, ${hung()}, 300000), (${trip.tripId}, ${id}, ${linh()}, 300000)`;
    });
  });

  it("chặn tổng phần chia khác số tiền (kiểm ở cuối giao dịch)", async () => {
    await expect(
      sql.begin(async (tx) => {
        const id = await insertExpense(tx, 600_000);
        await tx`insert into expense_shares (trip_id, expense_id, member_id, amount_vnd)
                 values (${trip.tripId}, ${id}, ${hung()}, 300000), (${trip.tripId}, ${id}, ${linh()}, 300001)`;
      }),
    ).rejects.toMatchObject({ code: "23514" });
  });

  it("chặn lần chuyển cho chính mình", async () => {
    await expect(sql`
      insert into payments (trip_id, from_member_id, to_member_id, amount_vnd, method, recorded_by_member_id)
      values (${trip.tripId}, ${hung()}, ${hung()}, 1000, 'sent', ${hung()})`).rejects.toMatchObject(
      {
        code: "23514",
      },
    );
  });

  it("chặn tên chủ tài khoản có dấu", async () => {
    await expect(sql`
      insert into payout_accounts (member_id, trip_id, bank_bin, account_number, account_name, saved_from_claimed_device)
      values (${hung()}, ${trip.tripId}, '970422', '000011112222', 'Nguyễn Văn Hùng', false)`).rejects.toMatchObject(
      {
        code: "23514",
      },
    );
  });

  it("chặn thành viên của kèo khác trong lần chuyển (khóa ngoại ghép trip_id)", async () => {
    const other = await createTrip(sql, ["Khoa"]);
    try {
      await expect(sql`
        insert into payments (trip_id, from_member_id, to_member_id, amount_vnd, method, recorded_by_member_id)
        values (${trip.tripId}, ${other.memberIds[0]}, ${hung()}, 1000, 'sent', ${hung()})`).rejects.toMatchObject(
        {
          code: "23503",
        },
      );
    } finally {
      await deleteTrip(sql, other);
    }
  });
});

describe("I-14 anon/authenticated không truy cập được bảng", () => {
  it("mọi bảng bật RLS và không có policy nào", async () => {
    const rows = await sql<{ relname: string; rls: boolean; policies: number }[]>`
      select c.relname, c.relrowsecurity as rls,
             (select count(*)::int from pg_policies p where p.schemaname = 'public' and p.tablename = c.relname) as policies
      from pg_class c join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r'`;
    expect(rows.map((r) => r.relname).sort()).toEqual([...TABLES].sort());
    for (const row of rows) {
      expect(row, row.relname).toMatchObject({ rls: true, policies: 0 });
    }
  });

  it.each(TABLES)("REST bằng anon key bị từ chối đọc và ghi bảng %s", async (table) => {
    const { apiUrl, anonKey } = inject("supabase");
    const headers = {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    };
    const read = await fetch(`${apiUrl}/rest/v1/${table}?select=*&limit=1`, { headers });
    expect([401, 403]).toContain(read.status);
    const write = await fetch(`${apiUrl}/rest/v1/${table}`, {
      method: "POST",
      headers,
      body: "{}",
    });
    expect([401, 403]).toContain(write.status);
  });
});
