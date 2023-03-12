import '../style/main.css';

function Banner() {
    // const [user, setUser] = useState(null);
    
    // useEffect(() => {
    //   firebase.auth().onAuthStateChanged(user => {
    //   setUser(user)
    // })
    // }, []);
  
    // console.log(user);
  
    return (
    <>
    
    <div class="banner">
                <div class="info">
                    <h1>“Get what ever you want” <br/> With us Let’s Auct !</h1>                    
                </div>
                <div class="banner-button">
                    <a href="#">Get Start</a>
                </div>
            </div>
      </>
    );
  };
  
  export default Banner;