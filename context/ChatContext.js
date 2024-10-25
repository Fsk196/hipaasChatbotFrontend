export const context = `
The Vehicle Sale Module streamlines the entire sales process, starting with a comprehensive Sales Dashboard that displays key metrics like today's follow-ups, open enquiries, pending money receipts, chassis pending for Pre-Delivery Inspection (PDI), chassis available for allocation, vehicle stock, and sales. The process begins with creating an enquiry by entering customer, model, and accessory details, followed by generating a quotation. Once confirmed, the user proceeds to Vehicle Booking, where booking details, rates, discounts, and selected accessories are finalized. The system allows modification until booking is confirmed, after which no edits are allowed. After booking, payments are recorded in the Money Received section, where users create a money receipt and allocate a chassis to the customer. Finally, the allocated chassis becomes available for Vehicle Invoicing. At this stage, users can generate and print necessary documents, such as the tax invoice, gate pass, delivery challan, and forms required for the vehicle's delivery. Throughout the process, users have options to view and edit details before final confirmation at each stage, ensuring accurate and flexible management of vehicle sales.
DealerPaaS is an AI-powered platform designed for auto dealerships.
It helps manage sales order processing, vehicle inventory, CRM, service operations, accounting, integration with OEM systems, and spare parts management.
The solution aims to streamline dealership operations, improve customer interactions, and ensure compliance with financial regulations.
Key features include sales order management, customer relationship management, service scheduling, financial tracking, and parts inventory management.
`;

// Fetches the latest context from the backend
export const latestCon = async () => {
  try {
    const response = await fetch(
      "https://hipaaschatbotbackend.onrender.com/context",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest context from backend:", error);
    throw error;
  }
};

export const contextdata = async () => {
  try {
    const data = await latestCon();
    console.log("Context data:", data); // Log the raw context data
    return data?.data || null; // Ensure to return the `data.data` field or null if it doesn't exist
  } catch (error) {
    console.error("Error in contextdata:", error);
    throw error;
  }
};
