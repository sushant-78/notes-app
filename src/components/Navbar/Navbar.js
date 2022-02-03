import "./Navbar.css";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/Auth";

export default function Navbar() {
    const { user, signOut } = useAuth();

    const navigate = useNavigate();

    async function handleSignOut() {
        await signOut();
        navigate("/login");
    }

    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header_logo">Minimal notes.</h1>

                <div className="header_info">
                    <p className="header_info-item">Welcome, {user?.id}!</p>
                    <button
                        onClick={handleSignOut}
                        className="header_info-item"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </header>
    );
}
