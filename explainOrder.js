const orders = [
    { customer: 'Alice', items: [{ name: 'Laptop', qty: 1, price: 1200 }, { name: 'Mouse', qty: 2, price: 25 }] },
    { customer: 'Bob', items: [{ name: 'Monitor', qty: 2, price: 300 }, { name: 'Mouse', qty: 1, price: 25 }] },
    { customer: 'Alice', items: [{ name: 'Keyboard', qty: 1, price: 100 }, { name: 'Monitor', qty: 1, price: 300 }] },
    { customer: 'Charlie', items: [{ name: 'Laptop', qty: 1, price: 1100 }, { name: 'Chair', qty: 1, price: 150 }] },
  ];
  
  const calculateOrderTotal = items =>
    items.reduce((total, { qty, price }) => total + qty * price, 0);
  
  const aggregateCustomerSpending = orders =>
    orders.reduce((summary, { customer, items }) => {
      summary[customer] = (summary[customer] || 0) + calculateOrderTotal(items);
      return summary;
    }, {});
  
  const topCustomers = (orders, minSpending) =>
    Object.entries(aggregateCustomerSpending(orders))
      .filter(([, total]) => total >= minSpending)
      .sort(([, a], [, b]) => b - a)
      .map(([customer, total]) => ({ customer, total }));
  
  console.log(topCustomers(orders, 1000));