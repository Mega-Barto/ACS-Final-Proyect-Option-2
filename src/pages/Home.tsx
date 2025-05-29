import { Link } from 'react-router-dom';
import { Package, Shield, Users, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="py-12 sm:py-16 lg:py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Manage Your Products</span>
          <span className="block text-primary-600">with Ease</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
          A simple, powerful product management system that helps you keep track of your products.
        </p>
        <div className="mt-10 flex justify-center">
          {isAuthenticated ? (
            <Link to="/products">
              <Button size="lg">
                View Your Products
              </Button>
            </Link>
          ) : (
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your products
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides all the tools you need to keep track of your products efficiently.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Package className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Product Management</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Easily create, update, and manage your products with our intuitive interface.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Shield className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Secure Authentication</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Your account and data are protected with industry-standard security measures.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Users className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">User Profiles</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Manage your profile and account settings with ease.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <Zap className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Fast Performance</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Enjoy a responsive and fast experience with our modern technology stack.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;