import "./App.css";

import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="bg-gray-200 flex flex-col h-screen">
      <Header />
      <Main />
      <Footer />
    </div>
  );
};

export default App;
