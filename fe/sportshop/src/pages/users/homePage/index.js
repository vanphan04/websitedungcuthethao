import { memo } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import cat1Img from "assets/users/images/categories/giay.png";
import cat2Img from "assets/users/images/categories/ao.jpg";
import cat3Img from "assets/users/images/categories/vot.jpg";
import cat4Img from "assets/users/images/categories/balo.jpg";
import cat5Img from "assets/users/images/categories/phukien.jpg";
import feature1Img from "assets/users/images/featured/giày.jpg";
import banner1Img from "assets/users/images/banner/index_banner_10.jpg";
import banner2Img from "assets/users/images/banner/index_banner_8.jpg";
import "./style.scss"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { ProductCard } from "component";  

const HomePage = () => {
    const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

    const sliderItems = [
        {
            bgImg:cat1Img,
            name: "Giày",
        },
        {
            bgImg:cat2Img,
            name: "Quần áo",
        },
        {
            bgImg:cat3Img,
            name: "Vợt",
        },
        {
            bgImg:cat4Img,
            name: "Ba lô",
        },
        {
            bgImg:cat5Img,
            name: "Phụ kiện",
        },
    ];

    const featProducts = {
      all: {
      tittle: "Toàn bộ",
      products: [
        {
          img: feature1Img,
          name: "Giày",
          price: 500000,
        },
        {
          img: feature1Img,
          name: "Giày",
          price: 500000,
        },
        {
          img: feature1Img,
          name: "Giày",
          price: 500000,
        },
        {
          img: feature1Img,
          name: "Giày",
          price: 500000,
        },
      ],
      },
      shoe: {
      tittle: "Giày",
      products: [
        {
          img: feature1Img,
          name: "Giày",
          price: 500000,
        },
      ],
      },
    };

    const renderFeaturedProducts = (data) =>{
      const tabList = [];
      const tabPanels= [];

      Object.keys(data).forEach((key, index)=>{
        console.log(key,index);
        tabList.push(<Tab key={index}>{data[key].tittle}</Tab>);
        
        const tabPanel= [];
        data[key].products.map((item, j)=>{
          return tabPanel.push(
          <div className="col-lg-3" key={j}>
            <ProductCard name={item.name} img={item.img} price={item.price} />
          </div>
          );
        });
        tabPanels.push(tabPanel);
      });


      console.log(data);
      return (
      <Tabs>
          <TabList>{tabList}</TabList>
          {
            tabPanels.map((item, key) =>(
              <TabPanel key={key}>
                <div className="row">{item}</div>
              </TabPanel>
            ))}
      </Tabs>
    )}

    return (
      <>
        {/*Categories Begin*/}

            <div className="container container__categories_slider">
                <Carousel responsive={responsive} className="categories_slider">
                    {
                        sliderItems.map((item, key)=>(

                    <div className="categories_slider_item" 
                    style={{backgroundImage:`url(${item.bgImg})`}}
                    key={key}>
                        <p>{item.name}</p>
                    </div>
                    ))}
                </Carousel>
            </div>
        {/*Categories End*/}
        {/* Featured Begin */}
        <div className="container">
          <div className="featured">
            <div className="section-tittle">
              <h2>
                Sản phẩm nổi bật
              </h2>
            </div>
              {renderFeaturedProducts(featProducts)}
          </div>
        </div>
        {/* Featured End */}
        {/* Banner Begin */}
          <div className="container">
              <div className="banner">
                <div className="banner__pic">
                  <img src={banner1Img} alt="banner"/>
                </div>
                <div className="banner__pic">
                  <img src={banner2Img} alt="banner"/>
                </div>
              </div>
          </div>
        {/* Banner End */}
      </>
    );
};

export default memo(HomePage);