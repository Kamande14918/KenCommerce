import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { createSeller, updateSeller, getSellerById } from '../../api/sellers';
import './SellerForm.css';

const SellerForm = ({ match }) => {
    const [sellerData, setSellerData] = useState({
        name: '',
        email: '',
        password: '',
        storeName: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (match.params.id) {
            setIsEditing(true);
            fetchSellerData(match.params.id);
        }
    }, [match.params.id]);

    const fetchSellerData = async (id) => {
        try {
            const response = await getSellerById(id);
            setSellerData(response.data);
        } catch (error) {
            console.error('Error fetching seller data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSellerData({ ...sellerData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateSeller(match.params.id, sellerData);
            } else {
                await createSeller(sellerData);
            }
            history.push('/sellers');
        } catch (error) {
            console.error('Error saving seller data:', error);
        }
    };

    return (
        <div className="seller-form-container">
            <h2>{isEditing ? 'Edit Seller' : 'Create Seller'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={sellerData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={sellerData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={sellerData.password}
                        onChange={handleChange}
                        required={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="storeName">Store Name</label>
                    <input
                        type="text"
                        id="storeName"
                        name="storeName"
                        value={sellerData.storeName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn">
                    {isEditing ? 'Update Seller' : 'Create Seller'}
                </button>
            </form>
        </div>
    );
};

export default SellerForm;