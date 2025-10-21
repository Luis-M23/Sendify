import { createClient } from "../client";

export interface SupabaseRealtimePayload<T> {
  schema: string;
  table: string;
  commit_timestamp: string;
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: T | null;
  old: T | null;
}

const supabase = createClient();

export class RealtimeService<T> {
  private channels: string[] = [];

  subscribe(
    table: string,
    filter: string,
    callback: (payload: SupabaseRealtimePayload<T>) => void
  ) {
    const channelName = `realtime-${table}-${filter}`;
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter,
        },
        (payload: SupabaseRealtimePayload<T>) => {
          callback(payload);
        }
      )
      .subscribe();

    this.channels.push(channelName);
    return channel;
  }

  unsubscribe(channel: any) {
    supabase.removeChannel(channel);
  }
}

export const Realtime = new RealtimeService<any>();
