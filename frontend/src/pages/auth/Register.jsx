import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = (values) => {
    dispatch(register(values));
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Register</h1>
        {error && <p className="text-red-500">{error}</p>}
        <Formik
          initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 rounded"
                disabled={isSubmitting || loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;