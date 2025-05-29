import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import Card, { CardContent, CardFooter } from './ui/Card';
import Button from './ui/Button';
import { Product } from '../services/productService';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(product.id);
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Card hoverable className="flex flex-col h-full">
      <CardContent className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
          <Link to={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3 mb-4">
          {product.description}
        </p>
        <p className="text-xl font-bold text-gray-900">
          {formatCurrency(product.price)}
        </p>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        {showDeleteConfirm ? (
          <div className="w-full">
            <p className="text-sm text-gray-700 mb-2">Are you sure you want to delete this product?</p>
            <div className="flex space-x-2">
              <Button
                variant="error"
                size="sm"
                fullWidth
                isLoading={isDeleting}
                onClick={confirmDelete}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={cancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="flex-1 flex items-center justify-center text-error-600 border-error-200 hover:bg-error-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
            <Link
              to={`/products/${product.id}`}
              className="flex-1"
            >
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;