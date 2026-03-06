import {useState,useEffect} from "react";

function App(){
  const[cars,setCars] = useState([]);
  const[token,setToken] = useState(null);
  const[username,setUsername] = useState("");
  const[password,setPassword] = useState("");
  const[brand,setBrand] =useState("");
  const[model,setModel] = useState("");
  const[price,setPrice] = useState("");

  useEffect(()=>{
    fetch("https://car-rental-api-lcsx.onrender.com/cars")
    .then(res => res.json())
    .then(data => setCars(data))
    
  },[])


  function handleLogin(){
    fetch("https://car-rental-api-lcsx.onrender.com/login",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({username,password})
    })
    .then(res => res.json())
    .then(data => {
      if (data.access_token){
        setToken(data.access_token);
        alert("Login successful!");
      }else{
        alert("Login failed!");
        alert("wrong username or password");
      }
    })
    
  }

  function handleAddCar(){
    fetch("https://car-rental-api-lcsx.onrender.com/cars",{
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({brand, model, price_per_day: price})
    })
    .then(res => res.json())
    .then (() => {
      fetch("https://car-rental-api-lcsx.onrender.com/cars")
        .then(res => res.json())
        .then(data => setCars(data))
    })
  }
  function handleDelete(carId){
    fetch(`https://car-rental-api-lcsx.onrender.com/cars/${carId}`,{
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(() => {
      setCars(cars.filter(car => car.id !== carId))
    })  
  }

  return(
    <div style={{maxWidth: "800px",margin: "0 auto",padding: "20px"}}>
      <h1>Car Rental App</h1>

      {!token ?(
        <div>
          <h2>Login</h2>
          <input placeholder="username" onChange={e => setUsername(e.target.value)}/>
          <input placeholder="password" type="password" onChange={e => setPassword(e.target.value)}/>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <p>Logged in!</p>
          {token && (
            <div style ={{marginTop: "20px"}}>
              <h2>Add New Car</h2>
              <input placeholder="Brand" onChange={e => setBrand(e.target.value)}/>
              <input placeholder="Model" onChange={e => setModel(e.target.value)}/>
              <input placeholder="Price per day" type="number" onChange={e => setPrice(e.target.value)}/>
              <button onClick={handleAddCar}>Add Car</button>
            </div>
          )}
          
        </div>
      )}
      {cars.map(car => (
        <div key={car.id} style={{border: "1px solid #ccc",padding: "15px",marginBottom: "15px",borderRadius: "8px"}}>
          <h3>{car.brand} - {car.model}</h3>
          <p>💰Price: ${car.price_per_day}/day</p>
          {token && (
            <button onClick={() => handleDelete(car.id)}>🗑️ Delete</button>
          )}
        </div>
      ))}
    </div>
  )
}

export default App;