// src/data/stores.ts

export interface Store {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    lat: number;
    lng: number;
  }
  
  export const stores: Store[] = [
    {
      id: 1,
      name: "Electronics - Nairobi",
      address: "123 Main Street, Nairobi, Kenya",
      phone: "+254710599234",
      email: "nairobi@guava.co.ke",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      lat: -1.292066,
      lng: 36.821945,
    },
    {
      id: 2,
      name: "Electronics - Mombasa",
      address: "456 Beach Road, Mombasa, Kenya",
      phone: "+254703849399",
      email: "mombasa@guava.co.ke",
      hours: "Mon-Sat: 10:00 AM - 7:00 PM",
      lat: -4.043477,
      lng: 39.668206,
    },
    {
      id: 3,
      name: "Electronics - Kisumu",
      address: "789 Lake View Avenue, Kisumu, Kenya",
      phone: "+254700112233",
      email: "kisumu@guava.co.ke",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      lat: -0.091702,
      lng: 34.768047,
    },
    {
      id: 4,
      name: "Electronics - Eldoret",
      address: "321 High Street, Eldoret, Kenya",
      phone: "+254701445566",
      email: "eldoret@guava.co.ke",
      hours: "Mon-Sat: 10:00 AM - 7:00 PM",
      lat: 0.514311,
      lng: 35.269789,
    },
    // Add more stores as needed
  ];
  