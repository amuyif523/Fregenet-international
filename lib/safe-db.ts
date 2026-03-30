export type SafeDbResult<T> = {
  data: T;
  unavailable: boolean;
};

export async function safeDbQuery<T>(
  label: string,
  query: () => Promise<T>,
  fallback: T
): Promise<SafeDbResult<T>> {
  try {
    return {
      data: await query(),
      unavailable: false,
    };
  } catch (error) {
    console.error(`Failed to load ${label}`, error);
    return {
      data: fallback,
      unavailable: true,
    };
  }
}
