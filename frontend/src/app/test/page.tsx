import CheckLogin from "@/components/checkLogin"
import LogoutButton from "@/components/logoutButton"

export default function TestPage() {

    return (
      <div>
        <CheckLogin />
        <h1>Test page</h1>
        <p>Only accessable to logged in users!</p>
        <br />
        <br />
        <br />
        <LogoutButton />
      </div>
    )
  }