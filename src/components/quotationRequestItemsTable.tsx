import React, { useState } from 'react';
interface TableComponentProps {
    products:any,
    onUpdateQuantity:any 
}
const QuotationRequestItemsTable: React.FC<TableComponentProps> = ({products, onUpdateQuantity}) => {
    const handleQuantityChange = (productId:string, newQuantity: any) => {//TODO: change type
        onUpdateQuantity(productId, newQuantity);
      };
    
      return (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Product Name</th>
              <th>Selling Price</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Pack Size</th>
              <th>UOM</th>
              <th>GST Rate</th>
              <th>Cess</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product : any) => (//TODO: change type
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.productName}</td>
                <td>{product.sellingPrice}</td>
                <td>{product.category}</td>
                <td>{product.subcategory}</td>
                <td>{product.packSize}</td>
                <td>{product.uom}</td>
                <td>{product.gstRate}</td>
                <td>{product.cess}</td>
                <td>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

export default QuotationRequestItemsTable