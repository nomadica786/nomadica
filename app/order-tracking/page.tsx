// app/order-tracking/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageLoader } from '@/components/ui/PageLoader';
import { api } from '@/components/api/api';
import { Truck, Calendar, DollarSign, Package } from 'lucide-react';

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setErrorMsg('');
    setTrackingInfo(null);
    
    try {
      const data = await api.orders.track(orderNumber.trim(), email.trim());
      if (data && data.order) {
        setTrackingInfo(data.order);
      } else {
        setErrorMsg('Order not found. Please double-check details.');
      }
    } catch (err) {
      console.error('Tracking query failed:', err);
      setErrorMsg('Order not found. Please check order number (e.g. NMD-2047) and email.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ paddingTop: "64px", backgroundColor: "#F7F4EE", minHeight: "100vh" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "4rem 1.5rem" }}>
        
        <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "0.75rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A5C3E", marginBottom: "1rem", textAlign: "center" }}>
          Shipment Tracking
        </p>
        <h1 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 600, color: "#1E1E1E", textAlign: "center", marginBottom: "2.5rem" }}>
          Track Your Order
        </h1>
        
        <form 
          onSubmit={handleSearch} 
          style={{ 
            backgroundColor: "#fff", 
            padding: "2rem", 
            border: "1px solid rgba(30,30,30,0.08)",
            boxShadow: "0 12px 32px rgba(30,30,30,0.04)",
            display: "grid", 
            gap: "1.5rem",
            marginBottom: "3rem"
          }}
        >
          <div>
            <label style={{ display: "block", fontFamily: "Satoshi", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>Order Number</label>
            <input
              type="text"
              placeholder="e.g. NMD-2047"
              className="form-input"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label style={{ display: "block", fontFamily: "Satoshi", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem" }}>Email Address</label>
            <input
              type="email"
              placeholder="e.g. arjun.mehta@email.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {errorMsg && (
            <p style={{ color: "rgba(180,60,60,0.9)", fontSize: "0.875rem", fontFamily: "Satoshi", margin: 0 }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={isSearching}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", height: "50px" }}
          >
            {isSearching ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {trackingInfo && (
          <div 
            style={{ 
              backgroundColor: "#fff", 
              padding: "2.5rem 2rem", 
              border: "1px solid rgba(30,30,30,0.08)",
              boxShadow: "0 12px 32px rgba(30,30,30,0.04)",
            }}
          >
            <h2 style={{ fontFamily: "Clash Display", fontSize: "1.375rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(30,30,30,0.08)", paddingBottom: "1rem" }}>
              Order {trackingInfo.orderNumber} Status
            </h2>

            <div style={{ display: "grid", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Package size={18} color="#7A5C3E" />
                <span style={{ fontFamily: "Satoshi", fontSize: "0.9375rem" }}>
                  Status: <strong>{trackingInfo.status || (trackingInfo.fulfillmentStatus === "FULFILLED" ? "Delivered" : "In Transit")}</strong>
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Calendar size={18} color="#7A5C3E" />
                <span style={{ fontFamily: "Satoshi", fontSize: "0.9375rem" }}>
                  Placed on: {new Date(trackingInfo.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <DollarSign size={18} color="#7A5C3E" />
                <span style={{ fontFamily: "Satoshi", fontSize: "0.9375rem" }}>
                  Total Amount: ₹{parseFloat(trackingInfo.totalPrice?.amount || '0').toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(30,30,30,0.08)" }}>
              <h3 style={{ fontFamily: "Clash Display", fontSize: "1.125rem", marginBottom: "1rem" }}>Items</h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {trackingInfo.lineItems?.edges?.map((edge: any) => (
                  <div key={edge.node.id} style={{ display: "flex", justifyContent: "space-between", fontFamily: "Satoshi", fontSize: "0.9375rem" }}>
                    <span>{edge.node.title} <span style={{ color: "rgba(30,30,30,0.4)" }}>x{edge.node.quantity}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
