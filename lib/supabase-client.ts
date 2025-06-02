// Simple fetch-based client for Supabase REST API

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

interface QueryOptions {
  select?: string
  order?: string
  limit?: number
  eq?: Record<string, any>
  in?: Record<string, any[]>
  like?: Record<string, string>
}

export async function fetchFromSupabase(table: string, options: QueryOptions = {}) {
  let url = `${supabaseUrl}/rest/v1/${table}?`

  // Add select
  if (options.select) {
    url += `select=${options.select}&`
  } else {
    url += "select=*&"
  }

  // Add order
  if (options.order) {
    url += `order=${options.order}&`
  }

  // Add limit
  if (options.limit) {
    url += `limit=${options.limit}&`
  }

  // Add equals filters
  if (options.eq) {
    Object.entries(options.eq).forEach(([key, value]) => {
      url += `${key}=eq.${value}&`
    })
  }

  // Add in filters
  if (options.in) {
    Object.entries(options.in).forEach(([key, values]) => {
      url += `${key}=in.(${values.join(",")})&`
    })
  }

  // Add like filters
  if (options.like) {
    Object.entries(options.like).forEach(([key, value]) => {
      url += `${key}=like.${value}&`
    })
  }

  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  })

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function insertIntoSupabase(table: string, data: any) {
  const url = `${supabaseUrl}/rest/v1/${table}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function updateInSupabase(table: string, data: any, conditions: Record<string, any>) {
  let url = `${supabaseUrl}/rest/v1/${table}?`

  // Add conditions
  Object.entries(conditions).forEach(([key, value]) => {
    url += `${key}=eq.${value}&`
  })

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function deleteFromSupabase(table: string, conditions: Record<string, any>) {
  let url = `${supabaseUrl}/rest/v1/${table}?`

  // Add conditions
  Object.entries(conditions).forEach(([key, value]) => {
    url += `${key}=eq.${value}&`
  })

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status} ${response.statusText}`)
  }

  return true
}

export async function executeSQL(sql: string) {
  const url = `${supabaseUrl}/rest/v1/rpc/exec_sql`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  })

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
