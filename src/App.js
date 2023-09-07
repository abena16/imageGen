import { useState, useEffect } from "react"

const App = () => {
  const [images, setImages] = useState(null)
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false); 


  const clearOptions = ['']

  const clearMe = () => {
    setImages(null)
    setError(null)
    setIsLoading(false); // Reset loading state
    const randomValue = clearOptions[Math.floor(Math.random() * clearOptions.length)]
    setValue(randomValue)
    };


    useEffect(() => {
      if (isLoading) {
        const loadingTimeout = setTimeout(() => {
          setError('No images fetched within 10 seconds.');
          setIsLoading(false);
        }, 10000);
  
        return () => {
          clearTimeout(loadingTimeout);
        };
      }
    }, [isLoading]);

    
  const getImages = async() =>{
    setImages(null)
    setError(null)
    setIsLoading(true); // Step 2


    if (!value) {
      setError('Error! Must have a search term');
      setIsLoading(false);
      return;
    }

    try{
      const options ={
        method: 'POST',
        body: JSON.stringify({
          message: value
        }),
        headers:{
          'Content-type' : 'application/json'
        }
      }

      const response = await fetch('http://localhost:8000/images', options);
      const data = await response.json();

      console.log(data);
      setImages(data);
      setError(null); // Clear any previous errors

      }catch (error){
        console.error(error);
        setError('An error occurred while fetching images.');

      }finally {
        setIsLoading(false);
      }
    };
  

  console.log(value)


  return (
    <div className="App">
      <header>Dream AI</header>

      <section className="search-section">
 
        <p>What did you dream about today?...</p>


        <div className="input-container">
          <input
            value={value} 
            placeholder="An inpressionist oil painting of a sunflower in a purplue vase..."
            onChange={e => setValue(e.target.value)}
            />
          <button onClick={getImages}>Generate</button>
        </div>

        <div className="clear-container">
          <span className="clear" onClick={clearMe}>Clear</span>
        </div>
      

      {error && <p>{error}</p>}

      </section>

      {isLoading ? <div className="spinner"></div> : null} 

      
      <section className="image-section">
        {images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={`Generated image of ${value}`}/>
        ))}
      </section>


    </div>
  ); 
}

export default App;
