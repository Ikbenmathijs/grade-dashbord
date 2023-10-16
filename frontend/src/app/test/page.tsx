import CheckLogin from "@/components/checkLogin"

export default function TestPage() {

    return (
      <div>
        <CheckLogin />
        <h1>Test page</h1>
        <p>Only accessable to logged in users!</p>
      </div>
    )
  }