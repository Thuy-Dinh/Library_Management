import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from "../Auth/login";
import HomePage from "../HomePage/homePage";
import BookDetail from "../BookDetail/bookDetail";
import LoanForm from "../loan/loanForm";
import Request from "../loan/request";
import AllLoan from "../loan/allLoan";
import Dashboard from "../admin/page/page";
import UserManagement from "../admin/userManagement/userManagement";
import UserCreate from "../admin/userManagement/userCreate";
import UserEdit from "../admin/userManagement/userEdit";
import ProductManagement from "../admin/bookManagament/productManagement";
import ProductCreate from "../admin/bookManagament/productCreate";
import ProductEdit from "../admin/bookManagament/productEdit";

// Component bảo vệ Route
function ProtectedRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <div className="main-body">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                isAuthenticated={isAuthenticated}
                                setIsAuthenticated={setIsAuthenticated}
                            />
                        }
                    />
                    <Route
                        path="/login"
                        element={<Login setIsAuthenticated={setIsAuthenticated} />}
                    />
                    <Route path="/detail-book" element={<BookDetail />} />
                    <Route
                        path="/form-loan"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <LoanForm
                                    isAuthenticated={isAuthenticated}
                                    setIsAuthenticated={setIsAuthenticated}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/request"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Request
                                    isAuthenticated={isAuthenticated}
                                    setIsAuthenticated={setIsAuthenticated}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/all-Loan"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <AllLoan
                                    isAuthenticated={isAuthenticated}
                                    setIsAuthenticated={setIsAuthenticated}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route 
                        path="/admin" 
                        element={<Dashboard 
                            isAuthenticated={isAuthenticated}
                            setIsAuthenticated={setIsAuthenticated}
                        />} 
                    />
                    <Route path="/admin/user-management" element={<UserManagement />} />
                    <Route path="/admin/user-management/user-create" element={<UserCreate />} />
                    <Route path="/admin/user-management/user-edit" element={<UserEdit />} />
                    <Route path="/admin/product-management" element={<ProductManagement />} />
                    <Route path="/admin/product-management/product-create" element={<ProductCreate />} />
                    <Route path="/admin/product-management/product-edit" element={<ProductEdit />} />
                    {/* <Route path="/admin/loan/loan-detail" element={<LoanDetail />} /> */}
                </Routes>
            </div>
        </Router>
    );
}
