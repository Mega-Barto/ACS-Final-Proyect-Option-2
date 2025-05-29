from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4
from db.database import get_db
from models.models import Product, User
from schemas.schemas import ProductCreate, ProductResponse, ProductUpdate
from routers.users import get_current_user

router = APIRouter()

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_product = Product(
        id=str(uuid4()),
        name=product.name,
        description=product.description,
        price=product.price,
        user_id=current_user.id
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("/", response_model=List[ProductResponse])
async def read_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all products
    products = db.query(Product).offset(skip).limit(limit).all()
    return products

@router.get("/user", response_model=List[ProductResponse])
async def read_user_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get only current user's products
    products = db.query(Product).filter(Product.user_id == current_user.id).all()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def read_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get the product
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if current user owns the product
    if product.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this product"
        )
    
    # Update product data
    if product_update.name is not None:
        product.name = product_update.name
    
    if product_update.description is not None:
        product.description = product_update.description
    
    if product_update.price is not None:
        product.price = product_update.price
    
    db.commit()
    db.refresh(product)
    
    return product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get the product
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if current user owns the product
    if product.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this product"
        )
    
    # Delete product
    db.delete(product)
    db.commit()
    
    return None