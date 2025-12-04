import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		// Validation du mot de passe
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;
		if (password !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas.");
			return;
		}
		if (!passwordRegex.test(password)) {
			setError("Le mot de passe doit contenir au moins 8 caractères, dont une lettre et un chiffre.");
			return;
		}
		try {
			await register({ username, email, password });
			navigate("/login");
		} catch (err) {
			if (err.response && err.response.data && err.response.data.message) {
				setError(err.response.data.message);
			} else {
				setError("Une erreur est survenue. Vérifie le backend et la connexion.");
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Inscription</h2>
			<input
				type="text"
				placeholder="Nom d'utilisateur"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
			/>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Mot de passe"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<label htmlFor="confirmPassword">Confirmez le mot de passe</label>
			<input
				id="confirmPassword"
				type="password"
				placeholder="Confirmez le mot de passe"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				required
			/>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<button type="submit">S'inscrire</button>
		</form>
	);
}
