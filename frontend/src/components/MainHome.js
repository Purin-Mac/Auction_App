import '../style/main.css';
import Category from './Category';
import Discover from './Discover';


function MainHome() {

    return (
    <>
    
    <main>
        <div className="reccommend">
            <h1>Our Recommend</h1>
            <p>Explore categories that we recommend.</p>
            <Category link={"/category_product"}/>
        </div>
        <div className="discover">
            <h1>Discover</h1>
            <p>These are some interesting product we have !</p>
            <Discover />
        </div>
    </main>

    <section>
        <div className="main-advertise">

        </div>
    </section>

      </>
    );
  };
  
  export default MainHome;