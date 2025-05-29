import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import Card, { CardContent, CardFooter } from '../components/ui/Card';
import { productService, UpdateProductData, Product } from '../services/productService';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<UpdateProductData>();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        setIsFetching(true);
        const product = await productService.getProduct(id);
        reset({
          name: product.name,
          description: product.description,
          price: product.price
        });
      } catch (error) {
        setError('Failed to load product. Please try again.');
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchProduct();
  }, [id, reset]);
  
  const onSubmit = async (data: UpdateProductData) => {
    try {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      await productService.updateProduct(id, data);
      navigate(`/products/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate(`/products/${id}`)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Product
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Product</h1>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <Input
              label="Product Name"
              placeholder="Enter product name"
              {...register('name', { required: 'Product name is required' })}
              error={errors.name?.message}
            />
            
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter product description"
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
              )}
            </div>
            
            <Input
              label="Price"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              {...register('price', { 
                required: 'Price is required',
                valueAsNumber: true,
                min: { value: 0.01, message: 'Price must be greater than 0' }
              })}
              error={errors.price?.message}
            />
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/products/${id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
            >
              Update Product
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditProduct;