'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '../../lib/supabase'

export default function SupabaseTestPage() {
  const [todos, setTodos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClientComponentClient()

    async function getTodos() {
      const { data, error } = await supabase.from('todos').select()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setTodos(data)
      setLoading(false)
    }

    getTodos()
  }, [])

  if (loading) {
    return <div>Loading todos...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase Todos</h1>
      {todos.length === 0 ? (
        <p>No todos found. Make sure you have a 'todos' table in Supabase with some data.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.task}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
