import { useEffect, useState } from 'react'
import { expenseService } from '../services/api'

function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await expenseService.getAll()
      setExpenses(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      setLoading(false)
    }
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div>
      <h1 className="page-title">Expenses</h1>
      
      <div className="card">
        <button className="btn btn-primary">Add New Expense</button>
      </div>

      <div className="stat-card">
        <h3>Total Expenses</h3>
        <p>${totalExpenses.toFixed(2)}</p>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No expenses found</td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.category}</td>
                  <td>${expense.amount}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>{expense.description}</td>
                  <td>
                    <button className="btn btn-sm">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Expenses
