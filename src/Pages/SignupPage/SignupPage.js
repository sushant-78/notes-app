import "./SignupPage.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

const SignupPage = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const initialValues = {
        email: "",
        password: "",
    };

    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [signupError, setSignupError] = useState(false);

    //to handle form changes.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    //to handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        setIsSubmit(true);
    };

    useEffect(() => {
        const response = async () => {
            if (Object.keys(formErrors).length === 0 && isSubmit) {
                const { error } = await signUp({
                    ...formValues,
                });

                if (error) {
                    setSignupError(error.message);
                } else {
                    // Redirect user to Dashboard
                    navigate("/");
                }
            }
        };

        response();
    }, [formErrors]);

    //function to validate form.
    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }

        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 4) {
            errors.password = "Password must be more than 4 characters";
        } else if (values.password.length > 10) {
            errors.password = "Password cannot exceed more than 10 characters";
        }

        return errors;
    };

    return (
        <div className="signup-form-container">
            <form onSubmit={handleSubmit} className="signup-form">
                {signupError && <p>{signupError}</p>}
                <h1>Signup Form</h1>
                <div className="signup-form_input-group">
                    <div className="input-group_input-container">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="email"
                            value={formValues.email}
                            onChange={handleChange}
                        />
                    </div>
                    <p>{formErrors.email}</p>

                    <div className="input-group_input-container">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            value={formValues.password}
                            onChange={handleChange}
                        />
                    </div>
                    <p>{formErrors.password}</p>
                    <button className="signup-form_btn">Submit</button>
                </div>
                <div>
                    Already a member? <Link to={"/login"}>Login</Link> here.
                </div>
            </form>
        </div>
    );
};

export default SignupPage;
