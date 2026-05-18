export async function fetchEntities() {
  const res = await fetch("/api/entities");
  if (!res.ok) throw new Error("Failed to fetch entities");
  return res.json();
}

export async function createEntity(data: { name: string; type: string }) {
  const res = await fetch("/api/entities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create entity");
  return res.json();
}

export async function updateEntity(id: string, data: { name: string; type: string }) {
  const res = await fetch(`/api/entities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update entity");
  return res.json();
}

export async function fetchTransactions(entityId?: string) {
  const url = entityId ? `/api/transactions?entityId=${entityId}` : "/api/transactions";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

export async function createTransaction(data: any) {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  return res.json();
}

export async function fetchAnalysisSummary(entityId?: string) {
  const url = entityId ? `/api/analysis/summary?entityId=${entityId}` : "/api/analysis/summary";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}

export async function fetchCategoryDistribution(entityId?: string) {
    const url = entityId ? `/api/analysis/categories?entityId=${entityId}` : "/api/analysis/categories";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

export async function fetchCurrentUser() {
  const res = await fetch("/api/users/me");
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
}

export async function updateProfile(data: any) {
  const res = await fetch("/api/users/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function updatePreferences(data: any) {
  const res = await fetch("/api/users/me/preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update preferences");
  return res.json();
}

export async function updateSecurity(data: any) {
  const res = await fetch("/api/users/me/security", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update security");
  return res.json();
}
