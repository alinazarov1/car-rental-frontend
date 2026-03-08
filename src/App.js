import {useState,useEffect} from "react";

function App(){
  const[cars,setCars] = useState([]);
  const[token,setToken] = useState(null);
  const[username,setUsername] = useState("");
  const[password,setPassword] = useState("");
  const[brand,setBrand] =useState("");
  const[model,setModel] = useState("");
  const[price,setPrice] = useState("");
  const[loading,setLoading] = useState(true);

  useEffect(()=>{
    fetch("https://car-rental-api-lcsx.onrender.com/cars")
    .then(res => res.json())
    .then(data => {
      setCars(data);
      setLoading(false);
    })
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
      body: JSON.stringify({brand, model, price_per_day: parseInt(price)})
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
    <div className = "min-h-screen bg-gray-100">

      {/* Header */}
      <div className = "bg-blue-600 text-white p-6 shadow-lg">
        <h1 className = "text-3xl font-bold">Car Rental</h1>
        <p className = "text-blue-200">Find your perfect ride</p>
      </div>

      <div className = "max-w-4xl mx-auto p-6">

        {/* Login / Logged in */}
        {!token ? (
          <div className = "bg-white p-6 rounded-lg shadow p-6 mb-6">
            <h2 className = "text-2xl font-bold mb-4">Login</h2>
            <input
              className = "border rounded p-2 w-full mb-3"
              placeholder="Username"
              onChange={e=> setUsername(e.target.value)}
              />
              <input
              className = "border rounded p-2 w-full mb-3"
              placeholder= "Password"
              type="password"
              onChange={e => setPassword(e.target.value)}
              />
              <button 
              className = "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={handleLogin}
              >
                Login
              </button>
            </div>
        ) : (
          <div className = "bg-white rounded-xl shadow p-6 mb-6">
            <p className = "text-green-600 font-bold mb-4">Logged in as {username}</p>
            <h2 className = "text-2xl font-bold mb-4">Add New Car</h2>
            <div className = "grid grid-cols-3 gap-3 mb-3">
              <input className = "border rounded p-2" placeholder="Brand" onChange={e=> setBrand(e.target.value)}/>
              <input className = "border rounded p-2" placeholder="Model" onChange={e=> setModel(e.target.value)}/>
              <input className = "border rounded p-2" placeholder="Price/day" type="number" onChange={e=> setPrice(e.target.value)}/>
            </div>
            <button 
            className = "bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={handleAddCar}
            >
              Add Car
            </button>
          </div>
        )}

        {/* Car List */}
        <h2 className="text-2xl font-bold mb-4">Aviable Cars</h2>
        {loading ? (
          <p className="text-gray-500">Loading cars...</p>
        ): cars.length === 0 ?(
          <p className="text-gray-500">No cars available</p>
        ):(
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cars.map(car=>(
              <div key={car.id} className="bg-white rounded-xl shadow p-5 hover:shadow-md transition">
                <h3 className="text-xl font-bold">{car.brand} {car.model}</h3>
                <p className="text-gray-600">Price per day: ${car.price_per_day}</p>
                {token &&(
                  <button 
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                  onClick={() => handleDelete(car.id)}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App;