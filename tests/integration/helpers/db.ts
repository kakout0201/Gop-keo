import { randomBytes, randomUUID } from "node:crypto";
import postgres from "postgres";
import { inject } from "vitest";

// Kết nối Postgres trực tiếp tới DB LOCAL để dựng dữ liệu test (insert nhiều bảng trong 1 giao dịch,
// thứ PostgREST không làm được vì khóa ngoại vòng tròn trips ↔ members). App thật không dùng kết nối này.
export function connectLocalDb() {
  return postgres(inject("supabase").dbUrl, { max: 2, onnotice: () => {} });
}

export type Sql = ReturnType<typeof connectLocalDb>;

const BASE62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function randomSlug(): string {
  return Array.from(randomBytes(16), (b) => BASE62[b % 62]).join("");
}

export type TripFixture = {
  tripId: string;
  deviceId: string;
  memberIds: string[];
};

// Kèo tối thiểu: 1 thiết bị, các thành viên theo thứ tự vào kèo, người đầu tiên là người tạo.
export async function createTrip(
  sql: Sql,
  names: string[] = ["Hùng", "Linh"],
): Promise<TripFixture> {
  const tripId = randomUUID();
  const deviceId = randomUUID();
  const memberIds = names.map(() => randomUUID());
  await sql.begin(async (tx) => {
    await tx`insert into devices (id, token_hash) values (${deviceId}, ${randomBytes(32)})`;
    await tx`
      insert into trips (id, slug, title, creator_member_id, created_by_device_id)
      values (${tripId}, ${randomSlug()}, 'Kèo test', ${memberIds[0]}, ${deviceId})`;
    for (const [i, name] of names.entries()) {
      await tx`
        insert into members (id, trip_id, display_name, name_key, join_order)
        values (${memberIds[i]}, ${tripId}, ${name}, ${"m" + (i + 1)}, ${i + 1})`;
    }
    await tx`
      insert into member_devices (trip_id, member_id, device_id, claimed_via)
      values (${tripId}, ${memberIds[0]}, ${deviceId}, 'created')`;
  });
  return { tripId, deviceId, memberIds };
}

// Dọn dữ liệu test. Schema không xóa dây chuyền từ members sang expenses/payments/trip_events (v1 không có
// tính năng xóa kèo), nên xóa các bảng đó trước rồi mới xóa kèo.
export async function deleteTrip(sql: Sql, fixture: TripFixture): Promise<void> {
  await sql.begin(async (tx) => {
    await tx`delete from trip_events where trip_id = ${fixture.tripId}`;
    await tx`delete from payments where trip_id = ${fixture.tripId}`;
    await tx`delete from expenses where trip_id = ${fixture.tripId}`;
    await tx`delete from trips where id = ${fixture.tripId}`;
    await tx`delete from devices where id = ${fixture.deviceId}`;
  });
}
