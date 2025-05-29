import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Card, { CardContent, CardFooter } from '../components/ui/Card';
import { productService, Product } from '../services/productService';
import { formatCurrency, formatDate } from '../utils/formatters';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await productService.getProduct(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };
  
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    try {
      if (!id) return;
      setIsDeleting(true);
      await productService.deleteProduct(id);
      navigate('/products');
    } catch (err) {
      setError('Failed to delete product. Please try again later.');
      console.error(err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!product && !loading) {
    return (
      <div>
        <div className="mb-6">
          <Link 
            to="/products"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        
        <Alert 
          variant="error" 
          title="Error" 
          className="mb-6"
        >
          Product not found or you don't have permission to view it.
        </Alert>
        
        <div className="mt-4">
          <Button onClick={() => navigate('/products')}>
            Return to Products
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <Link 
          to="/products"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{product?.name}</h1>
      </div>
      
      {error && (
        <Alert 
          variant="error" 
          title="Error" 
          onClose={() => setError(null)}
          className="mb-6"
        >
          {error}
        </Alert>
      )}
      
      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{product?.name}</h2>
              <p className="text-2xl font-bold text-primary-600 mt-2">
                {product && formatCurrency(product.price)}
              </p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                Created: {product && formatDate(product.created_at)}
              </p>
              <p className="text-sm text-gray-500">
                Last Updated: {product && formatDate(product.updated_at)}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 whitespace-pre-line">{product?.description}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4">
          {showDeleteConfirm ? (
            <div className="w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Product</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="error"
                  className="w-full sm:w-auto"
                  isLoading={isDeleting}
                  onClick={confirmDelete}
                >
                  Yes, Delete Product
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={cancelDelete}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full">
              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
              <Button
                variant="error"
                className="flex items-center justify-center"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Product
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProductDetail;