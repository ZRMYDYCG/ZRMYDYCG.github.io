---
title: React结合TailwindCss开发官网首页
date: 2024-01-31 22:49:45
tags:
  - TailwindCss
categories:
  - React
cover: https://pic.imgdb.cn/item/65ccd7439f345e8d03b13b8c.jpg
---
## 前言

[TailwindCSS中文文档|TailwindCSS中文网]( https://www.tailwindcss.cn/docs/installation)

`Tailwind CSS` 可不是来吹风的，它是个“实用至上”的 `CSS` 框架。不像其他框架那样，给你一堆组件让你去挑选，`Tailwind CSS` 提供了一堆小巧精致的工具类，可以让你自由组合。

它的核心理念就是“功能类优先”，也就是说，每一个 `class` 都代表了一个 `CSS` 属性，这可真是把 **“原子化”** 发挥到了极致。

而且，`Tailwind CSS` 它还支持响应式设计，可以根据不同的屏幕尺寸，自动调整样式。

同时，它还支持暗黑模式。

![TailwindCSS](https://pic.imgdb.cn/item/65ccd3cf9f345e8d03a02e2c.webp)

[React官方中文文档](https://react.docschina.org/)

`React` 是一个用于构建用户界面的 `JavaScript` 库，由 `Facebook` 的开发者和社区共同维护和更新。`React` 采用了声明式编程的思想，让开发者只需要关注应用的状态和如何展示状态，而不需要手动操作 `DOM`。这使得 `React` 在构建大型、复杂的单页应用（SPA）时非常高效。

React 还拥有丰富的生态系统和开发工具，如 `React` `DevTools`、`Redux`、`React Router` 等。

![React](https://pic.imgdb.cn/item/65ccd3fc9f345e8d03a10433.webp)

## React 结合 TailwindCSS

1. 组件化开发

`React` 的组件化开发方式与 `Tailwind CSS` 的实用类优先理念非常契合。

2. 样式编写

这与 `React` 的 `JSX` 语法相结合，添加少量的类名，就能快速实现复杂的样式效果。

3. 响应式设计

`Tailwind CSS` 内置了响应式设计功能，结合 `React` 的条件渲染和状态管理功能，可以实现复杂的响应式布局和交互效果。

当然，还有很多两者相结合起来所迸发出来的开发优点，慢慢探索吧。

## 项目搭建

### 0. vite 初始化一个 React 项目

```bash
npm create vite@latest ./ -- --template react
```

```bash
npm install
```

### 1. 引进 TailwindCSS

#### 1.1 在项目中安装依赖

```bash
npm install -D tailwindcss postcss autoprefixer
```

#### 1.2 并创建配置文件

```bash
npx tailwindcss init -p
```

#### 1.3 修改 `tailwind.config.js` 配置文件内容

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### 1.4 在项目中添加TailwindCSS样式

可以在 index.css 文件中引入：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

于 main.jsx 文件导入

```js
import './index.css'
```

#### 1.5 Vscode 配置智能提示

如果在编写样式的时候，没有智能提示，那么可以安装一个插件


![](https://pic.imgdb.cn/item/65ccd46c9f345e8d03a3171e.webp)

### 2. 拆分官网首页

- Section`0` Header
- Section`1` Hero
- Section`2` PopularProducts
- Section`3` SuperQuality
- Section`4` Services
- Section`5` SpecialOffer
- Section`6` CustomerReviews
- Section`7` Subscribe
- Section`8` Footer

### 3. 提供 Mock 拦截环境

安装 Mock.js

```bash
import Mock from 'mockjs'

// 导航链接
Mock.mock('/api/navLinks', 'get', () => {
    return {
        data: [
            { href: "#home", label: "Home" },
            { href: "#about-us", label: "About Us" },
            { href: "#products", label: "Products" },
            { href: "#contact-us", label: "Contact Us" },
        ]
    };
})

// 鞋子数据
Mock.mock('/api/shoes', 'get', () => {
    return {
        data: [
            {
                thumbnail: '/src/assets/images/thumbnail-shoe1.svg',
                bigShoe: '/src/assets/images/big-shoe1.png',
            },
            {
                thumbnail: '/src/assets/images/thumbnail-shoe2.svg',
                bigShoe: '/src/assets/images/big-shoe2.png',
            },
            {
                thumbnail: '/src/assets/images/thumbnail-shoe3.svg',
                bigShoe: '/src/assets/images/big-shoe3.png',
            },
        ]
    };
})

// 统计数据
Mock.mock('/api/statistics', 'get', () => {
    return {
        data: [
            { value: '1k+', label: 'Brands' },
            { value: '500+', label: 'Shops' },
            { value: '250k+', label: 'Customers' },
        ]
    }
})

// 产品数据
Mock.mock('/api/products', 'get', () => {
    return {
        data: [
            {
                imgURL: '/src/assets/images/shoe4.svg',
                name: "Nike Air Jordan-01",
                price: "$200.20",
            },
            {
                imgURL: '/src/assets/images/shoe5.svg',
                name: "Nike Air Jordan-10",
                price: "$210.20",
            },
            {
                imgURL: '/src/assets/images/shoe6.svg',
                name: "Nike Air Jordan-100",
                price: "$220.20",
            },
            {
                imgURL: '/src/assets/images/shoe7.svg',
                name: "Nike Air Jordan-001",
                price: "$230.20",
            },
        ]
    }
})

// 服务数据
Mock.mock('/api/services', 'get', () => {
    return {
        data: [
            {
                imgURL: '/src/assets/icons/truck-fast.svg',
                label: "Free shipping",
                subtext: "Enjoy seamless shopping with our complimentary shipping service.",
            },
            {
                imgURL: '/src/assets/icons/shield-tick.svg',
                label: "Secure Payment",
                subtext: "Experience worry-free transactions with our secure payment options."
            },
            {
                imgURL: '/src/assets/icons/support.svg',
                label: "Love to help you",
                subtext: "Our dedicated team is here to assist you every step of the way."
            },
        ]
    }
})

// 评论数据
Mock.mock('/api/reviews', 'get', () => {
    return {
        data: [
            {
                imgURL: '/src/assets/images/customer1.jpeg',
                customerName: 'Morich Brown',
                rating: 4.5,
                feedback: "The attention to detail and the quality of the product exceeded my expectations. Highly recommended!",
            },
            {
                imgURL: '/src/assets/images/customer2.svg',
                customerName: 'Lota Mongeskar',
                rating: 4.5,
                feedback: "The product not only met but exceeded my expectations. I'll definitely be a returning customer!"
            }
        ]
    }
})

// 页脚链接数据
Mock.mock('/api/footerLinks', 'get', () => {
    return {
        data: [
            {
                title: "Products",
                links: [
                    { name: "Air Force 1", link: "/" },
                    { name: "Air Max 1", link: "/" },
                    { name: "Air Jordan 1", link: "/" },
                    { name: "Air Force 2", link: "/" },
                    { name: "Nike Waffle Racer", link: "/" },
                    { name: "Nike Cortez", link: "/" },
                ],
            },
            {
                title: "Help",
                links: [
                    { name: "About us", link: "/" },
                    { name: "FAQs", link: "/" },
                    { name: "How it works", link: "/" },
                    { name: "Privacy policy", link: "/" },
                    { name: "Payment policy", link: "/" },
                ],
            },
            {
                title: "Get in touch",
                links: [
                    { name: "customer@nike.com", link: "mailto:customer@nike.com" },
                    { name: "+92554862354", link: "tel:+92554862354" },
                ],
            },
        ]
    }
})

// 社交媒体数据
Mock.mock('/api/socialMedia', 'get', () => {
    return {
        data: [
            { src: '/src/assets/icons/facebook.svg', alt: "facebook logo" },
            { src: '/src/assets/icons/twitter.svg', alt: "twitter logo" },
            { src: '/src/assets/icons/instagram.svg', alt: "instagram logo" },
        ]
    }
})

// 启动 Mock 服务
Mock.setup({
    timeout: '200-400'
})
```

于 main.js 中启动 Mock 服务

```js
import '@/mock'
```

### 4. 二次封装 axios 并提供 api 接口

```js
import axios from 'axios'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})

request.interceptors.request.use((config) => {
  nprogress.start()
  return config
})

request.interceptors.response.use((res) => {
  nprogress.done()
  return res.data
}, (error) => {
  return Promise.reject(error)
})

export const getNavLinks = () => request({ url: '/navLinks' })
export const getShoes = () => request({ url: '/shoes'})
export const getStatistics = () => request({ url: '/statistics' })
export const getProducts = () => request({ url: '/products' })
export const getServices = () => request({ url: '/services' })
export const getReviews = () => request({ url: '/reviews' })
export const getFooterLinks = () => request({ url: '/footerLinks' })
export const getSocialMedia = () => request({ url: '/socialMedia' })
```

### 5. 完成组件封装及页面动态渲染

项目文件


![目录](https://pic.imgdb.cn/item/65ccd4a39f345e8d03a4136b.webp)


#### `App.jsx`

```jsx
import { Nav } from "./components";
import {
  CustomerReviews,
  Footer,
  Hero,
  PopularProducts,
  Services,
  SpecialOffer,
  Subscribe,
  SuperQuality,
} from "./sections";

const App = () => {
  return (
    <main className='relative'>
      <Nav />
      <section className='xl:padding-l wide:padding-r padding-b'>
        <Hero />
      </section>
      <section className='padding'>
        <PopularProducts />
      </section>
      <section className='padding'>
        <SuperQuality />
      </section>
      <section className='padding-x py-10'>
        <Services />
      </section>
      <section className='padding'>
        <SpecialOffer />
      </section>
      <section className='bg-pale-blue padding'>
        <CustomerReviews />
      </section>
      <section className='padding-x sm:py-32 py-16 w-full'>
        <Subscribe />
      </section>
      <section className=' bg-black padding-x padding-t pb-8'>
        <Footer />
      </section>
    </main>
  );
};

export default App;
```

#### section

##### Hero.jsx


![](https://pic.imgdb.cn/item/65ccd4bd9f345e8d03a48927.webp)


```jsx
import { useState, useEffect } from "react";
import { getShoes, getStatistics } from '../api';
import { Button, ShoeCard } from "../components";
import { bigShoe1 } from "../assets/images";
import { arrowRight } from "../assets/icons";

const Hero = () => {
  const [bigShoeImg, setBigShoeImg] = useState(bigShoe1);
  const [shoes, setShoes] = useState([]);
  const [statistics, setStatistics] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOfShoes = await getShoes();
        console.log(responseOfShoes);
        const responseOfStatistics = await getStatistics()
        console.log(responseOfStatistics);
        setShoes(responseOfShoes.data);
        setStatistics(responseOfStatistics.data);
      } catch (error) {
        console.error("Error fetching nav links:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <section
      id='home'
      className='w-full flex xl:flex-row flex-col justify-center min-h-screen gap-10 max-container'
    >
      <div className='relative xl:w-2/5 flex flex-col justify-center items-start w-full  max-xl:padding-x pt-28'>
        <p className='text-xl font-montserrat text-coral-red'>
          Our Summer collections
        </p>

        <h1 className='mt-10 font-palanquin text-8xl max-sm:text-[72px] max-sm:leading-[82px] font-bold'>
          <span className='xl:bg-white xl:whitespace-nowrap relative z-10 pr-10'>
            The New Arrival
          </span>
          <br />
          <span className='text-coral-red inline-block mt-3'>Nike</span> Shoes
        </h1>
        <p className='font-montserrat text-slate-gray text-lg leading-8 mt-6 mb-14 sm:max-w-sm'>
          Discover stylish Nike arrivals, quality comfort, and innovation for
          your active life.
        </p>

        <Button label='Shop now' iconURL={arrowRight} />

        <div className='flex justify-start items-start flex-wrap w-full mt-20 gap-16'>
          {statistics.map((stat, index) => (
            <div key={index}>
              <p className='text-4xl font-palanquin font-bold'>{stat.value}</p>
              <p className='leading-7 font-montserrat text-slate-gray'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='relative flex-1 flex justify-center items-center xl:min-h-screen max-xl:py-40 bg-primary bg-hero bg-cover bg-center'>
        <img
          src={bigShoeImg}
          alt='shoe colletion'
          width={610}
          height={502}
          className='object-contain relative z-10'
        />

        <div className='flex sm:gap-6 gap-4 absolute -bottom-[5%] sm:left-[10%] max-sm:px-6'>
          {shoes.map((image, index) => (
            <div key={index}>
              <ShoeCard
                index={index}
                imgURL={image}
                changeBigShoeImage={(shoe) => setBigShoeImg(shoe)}
                bigShoeImg={bigShoeImg}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

##### PopularProducts.jsx

![](https://pic.imgdb.cn/item/65ccd4d39f345e8d03a4ec80.webp)

```jsx
import { getProducts } from '../api'
import { useState, useEffect } from "react";
import { PopularProductCard } from "../components";

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProducts();
        console.log(response)
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching nav links:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <section id='products' className='max-container max-sm:mt-12'>
      <div className='flex flex-col justify-start gap-5'>
        <h2 className='text-4xl font-palanquin font-bold'>
          Our <span className='text-coral-red'> Popular </span> Products
        </h2>
        <p className='lg:max-w-lg mt-2 font-montserrat text-slate-gray'>
          Experience top-notch quality and style with our sought-after
          selections. Discover a world of comfort, design, and value
        </p>
      </div>

      <div className='mt-16 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-6 gap-14'>
        {products.map((product) => (
          <PopularProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  );
};

export default PopularProducts;
```


##### SuperQuality.jsx


![](https://pic.imgdb.cn/item/65ccd4ef9f345e8d03a57533.webp)


```jsx
import { shoe8 } from "../assets/images";
import { Button } from "../components";

const SuperQuality = () => {
  return (
    <section
      id='about-us'
      className='flex justify-between items-center max-lg:flex-col gap-10 w-full max-container'
    >
      <div className='flex flex-1 flex-col'>
        <h2 className='font-palanquin capitalize text-4xl lg:max-w-lg font-bold'>
          We Provide You
          <span className='text-coral-red'> Super </span>
          <span className='text-coral-red'>Quality </span> Shoes
        </h2>
        <p className='mt-4 lg:max-w-lg info-text'>
          Ensuring premium comfort and style, our meticulously crafted footwear
          is designed to elevate your experience, providing you with unmatched
          quality, innovation, and a touch of elegance.
        </p>
        <p className='mt-6 lg:max-w-lg info-text'>
          Our dedication to detail and excellence ensures your satisfaction
        </p>
        <div className='mt-11'>
          <Button label='View details' />
        </div>
      </div>

      <div className='flex-1 flex justify-center items-center'>
        <img
          src={shoe8}
          alt='product detail'
          width={570}
          height={522}
          className='object-contain'
        />
      </div>
    </section>
  );
};

export default SuperQuality;
```

##### Services.jsx


![](https://pic.imgdb.cn/item/65ccd5039f345e8d03a5d429.webp)


```jsx
import { useState, useEffect } from "react";
import { getServices } from '../api';
import { ServiceCard } from "../components";

const Services = () => {
  const [services, setServices] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getServices();
        console.log(response);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching nav links:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <section className='max-container flex justify-center flex-wrap gap-9'>
      {services.map((service) => (
        <ServiceCard key={service.label} {...service} />
      ))}
    </section>
  );
};

export default Services;
```

##### SpecialOffer.jsx


![](https://pic.imgdb.cn/item/65ccd5149f345e8d03a624a2.webp)


```jsx
import { arrowRight } from "../assets/icons";
import { offer } from "../assets/images";
import { Button } from "../components";

const SpecialOffer = () => {
  return (
    <section className='flex justify-between items-center max-xl:flex-col-reverse gap-10 max-container'>
      <div className='flex-1'>
        <img
          src={offer}
          alt='Shoe Promotion'
          width={773}
          height={687}
          className='object-contain w-full'
        />
      </div>
      <div className='flex flex-1 flex-col'>
        <h2 className='text-4xl font-palanquin font-bold'>
          <span className='text-coral-red'>Special </span>
          Offer
        </h2>
        <p className='mt-4 info-text'>
          Embark on a shopping journey that redefines your experience with
          unbeatable deals. From premier selections to incredible savings, we
          offer unparalleled value that sets us apart.
        </p>
        <p className='mt-6 info-text'>
          Navigate a realm of possibilities designed to fulfill your unique
          desires, surpassing the loftiest expectations. Your journey with us is
          nothing short of exceptional.
        </p>
        <div className='mt-11 flex flex-wrap gap-4'>
          <Button label='Shop now' iconURL={arrowRight} />
          <Button
            label='Learn more'
            backgroundColor='bg-white'
            borderColor='border-slate-gray'
            textColor='text-slate-gray'
          />
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
```

##### CustomerReviews.jsx


![](https://pic.imgdb.cn/item/65ccd5219f345e8d03a661ec.webp)


```jsx
import { useState, useEffect } from 'react';
import { getReviews } from '../api';
import { ReviewCard } from "../components";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getReviews();
        console.log(response);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching nav links:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <section className='max-container'>
      <h3 className='font-palanquin text-center text-4xl font-bold'>
        What Our
        <span className='text-coral-red'> Customers </span>
        Say?
      </h3>
      <p className='m-auto mt-4 max-w-lg  text-center info-text'>
        Hear genuine stories from our satisfied customers about their
        exceptional experiences with us.
      </p>

      <div className='mt-24 flex flex-1 justify-evenly items-center max-lg:flex-col gap-14'>
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            imgURL={review.imgURL}
            customerName={review.customerName}
            rating={review.rating}
            feedback={review.feedback}
          />
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;
```

##### Subscribe.jsx


![](https://pic.imgdb.cn/item/65ccd5329f345e8d03a6b1c9.webp)


```jsx
import { Button } from "../components";

const Subscribe = () => {
  return (
    <section
      id='contact-us'
      className='max-container flex justify-between items-center max-lg:flex-col gap-10'
    >
      <h3 className='text-4xl leading-[68px] lg:max-w-md font-palanquin font-bold'>
        Sign Up for
        <span className='text-coral-red'> Updates </span>& Newsletter
      </h3>
      <div className='lg:max-w-[40%] w-full flex items-center max-sm:flex-col gap-5 p-2.5 sm:border sm:border-slate-gray rounded-full'>
        <input type='text' placeholder='subscribe@nike.com' className='input' />
        <div className='flex max-sm:justify-end items-center max-sm:w-full'>
          <Button label='Sign Up' fullWidth />
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
```

##### Footer.jsx


![](https://pic.imgdb.cn/item/65ccd5419f345e8d03a6f761.webp)


```jsx
import { useState, useEffect } from "react";
import { copyrightSign } from "../assets/icons";
import { footerLogo } from "../assets/images";
import { getFooterLinks, getSocialMedia } from '../api'

const Footer = () => {
  const [footerLinks, setFooterLinks] = useState([]);
  const [socialMedia, setSocialMedia] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseOfFooterLinks = await getFooterLinks();
        const responseOfSocialMedia = await getSocialMedia();
        console.log(responseOfFooterLinks)
        console.log(responseOfSocialMedia)
        setFooterLinks(responseOfFooterLinks.data);
        setSocialMedia(responseOfSocialMedia.data);
      } catch (error) {
        console.error("Error fetching nav links:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <footer className='max-container'>
      <div className='flex justify-between items-start gap-20 flex-wrap max-lg:flex-col'>
        <div className='flex flex-col items-start'>
          <a href='/'>
            <img
              src={footerLogo}
              alt='logo'
              width={150}
              height={46}
              className='m-0'
            />
          </a>
          <p className='mt-6 text-base leading-7 font-montserrat text-white-400 sm:max-w-sm'>
            Get shoes ready for the new term at your nearest Nike store. Find
            Your perfect Size In Store. Get Rewards
          </p>
          <div className='flex items-center gap-5 mt-8'>
            {socialMedia.map((icon) => (
              <div
                className='flex justify-center items-center w-12 h-12 bg-white rounded-full'
                key={icon.alt}
              >
                <img src={icon.src} alt={icon.alt} width={24} height={24} />
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-1 justify-between lg:gap-10 gap-20 flex-wrap'>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className='font-montserrat text-2xl leading-normal font-medium mb-6 text-white'>
                {section.title}
              </h4>
              <ul>
                {section.links.map((link) => (
                  <li
                    className='mt-3 font-montserrat text-base leading-normal text-white-400 hover:text-slate-gray'
                    key={link.name}
                  >
                    <a href={link.link}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-between text-white-400 mt-24 max-sm:flex-col max-sm:items-center'>
        <div className='flex flex-1 justify-start items-center gap-2 font-montserrat cursor-pointer'>
          <img
            src={copyrightSign}
            alt='copyright sign'
            width={20}
            height={20}
            className='rounded-full m-0'
          />
          <p>Copyright. All rights reserved.</p>
        </div>
        <p className='font-montserrat cursor-pointer'>Terms & Conditions</p>
      </div>
    </footer>
  );
};

export default Footer;
```


#### component

##### index.js

将组件统一暴露

```js
import Button from "./Button";
import Nav from "./Nav";
import ShoeCard from "./ShoeCard";
import PopularProductCard from "./PopularProductCard";
import ServiceCard from "./ServiceCard";
import ReviewCard from "./ReviewCard";

export {
    Button,
    Nav,
    ShoeCard,
    PopularProductCard,
    ServiceCard,
    ReviewCard,
}
```

##### Nav.jsx


![](https://pic.imgdb.cn/item/65ccd5629f345e8d03a7f431.webp)


```jsx
import { useState, useEffect } from 'react';
import { hamburger } from "../assets/icons";
import { headerLogo } from "../assets/images";
import { getNavLinks } from '../api';

const Nav = () => {
  const [navLinks, setNavLinks] = useState([]); // 初始化状态：空数组
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNavLinks();
        console.log(response);
        setNavLinks(response.data);
      } catch (error) {
        console.error("Error fetching nav links:", error);
      }
    };
    fetchData(); // 组件挂载时：调用
  }, []); // 空的依赖数组：表示这个 effect 只会在组件挂载时运行一次
  return (
    <header className='padding-x py-8 absolute z-10 w-full'>
      <nav className='flex justify-between items-center max-container'>
        <a href='/'>
          <img
            src={headerLogo}
            alt='logo'
            width={129}
            height={29}
            className='m-0 w-[129px] h-[29px]'
          />
        </a>
        <ul className='flex-1 flex justify-center items-center gap-16 max-lg:hidden'>
          {navLinks.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className='font-montserrat leading-normal text-lg text-slate-gray'
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className='flex gap-2 text-lg leading-normal font-medium font-montserrat max-lg:hidden wide:mr-24'>
          <a href='/'>Sign in</a>
          <span>/</span>
          <a href='/'>Explore now</a>
        </div>
        <div className='hidden max-lg:block'>
          <img src={hamburger} alt='hamburger icon' width={25} height={25} />
        </div>
      </nav>
    </header>
  );
};

export default Nav;
```

##### Button.jsx


![](https://pic.imgdb.cn/item/65ccd57e9f345e8d03a8b13c.webp)


![](https://pic.imgdb.cn/item/65ccd58c9f345e8d03a8ef92.webp)


![](https://pic.imgdb.cn/item/65ccd59b9f345e8d03a93476.webp)


![](https://pic.imgdb.cn/item/65ccd5aa9f345e8d03a97c0f.webp)


```jsx
const Button = ({
  label,
  iconURL,
  backgroundColor,
  textColor,
  borderColor,
  fullWidth,
}) => {
  return (
    <button
      className={`flex justify-center items-center gap-2 px-7 py-4 border font-montserrat text-lg leading-none
      ${
        backgroundColor
          ? `${backgroundColor} ${textColor} ${borderColor}`
          : "bg-coral-red text-white border-coral-red"
      } rounded-full ${fullWidth && "w-full"}`}
    >
      {label}

      {iconURL && (
        <img
          src={iconURL}
          alt='arrow right icon'
          className='ml-2 rounded-full bg-white w-5 h-5'
        />
      )}
    </button>
  );
};

export default Button;
```

##### PopularProductCard.jsx


![](https://pic.imgdb.cn/item/65ccd5be9f345e8d03a9e10f.webp)


```jsx
import { star } from "../assets/icons";

const PopularProductCard = ({ imgURL, name, price }) => {
  return (
    <div className='flex flex-1 flex-col w-full max-sm:w-full'>
      <img src={imgURL} alt={name} className='w-[282px] h-[282px]' />
      <div className='mt-8 flex justify-start gap-2.5'>
        <img src={star} alt='rating icon' width={24} height={24} />
        <p className='font-montserrat text-xl leading-normal text-slate-gray'>
          (4.5)
        </p>
      </div>
      <h3 className='mt-2 text-2xl leading-normal font-semibold font-palanquin'>
        {name}
      </h3>
      <p className='mt-2 font-semibold font-montserrat text-coral-red text-2xl leading-normal'>
        {price}
      </p>
    </div>
  );
};

export default PopularProductCard;
```

##### ReviewCard.jsx


![](https://pic.imgdb.cn/item/65ccd5cd9f345e8d03aa2451.webp)


```jsx
import { star } from "../assets/icons";

const ReviewCard = ({ imgURL, customerName, rating, feedback }) => {
  return (
    <div className='flex justify-center items-center flex-col'>
      <img
        src={imgURL}
        alt='customer'
        className='rounded-full object-cover w-[120px] h-[120px]'
      />
      <p className='mt-6 max-w-sm text-center info-text'>{feedback}</p>
      <div className='mt-3 flex justify-center items-center gap-2.5'>
        <img
          src={star}
          width={24}
          height={24}
          alt='rating star'
          className='object-contain m-0'
        />
        <p className='text-xl font-montserrat text-slate-gray'>({rating})</p>
      </div>
      <h3 className='mt-1 font-palanquin text-3xl text-center font-bold'>
        {customerName}
      </h3>
    </div>
  );
};

export default ReviewCard;
```

##### ServiceCard.jsx


![](https://pic.imgdb.cn/item/65ccd5dd9f345e8d03aa6c29.webp)


```jsx
const ServiceCard = ({ imgURL, label, subtext }) => {
  return (
    <div className='flex-1 sm:w-[350px] sm:min-w-[350px] w-full rounded-[20px] shadow-3xl px-10 py-16'>
      <div className='w-11 h-11 flex justify-center items-center bg-coral-red rounded-full'>
        <img src={imgURL} alt={label} width={24} height={24} />
      </div>
      <h3 className='mt-5 font-palanquin text-3xl leading-normal font-bold'>
        {label}
      </h3>
      <p className='mt-3 break-words font-montserrat text-lg leading-normal text-slate-gray'>
        {subtext}
      </p>
    </div>
  );
};

export default ServiceCard;
```

##### ShoeCard.jsx


![](https://pic.imgdb.cn/item/65ccd5f09f345e8d03aac0f8.webp)


```jsx
const ShoeCard = ({ imgURL, changeBigShoeImage, bigShoeImg }) => {
  const handleClick = () => {
    if (bigShoeImg !== imgURL.bigShoe) {
      changeBigShoeImage(imgURL.bigShoe);
    }
  };

  return (
    <div
      className={`border-2 rounded-xl ${
        bigShoeImg === imgURL.bigShoe
          ? "border-coral-red"
          : "border-transparent"
      } cursor-pointer max-sm:flex-1`}
      onClick={handleClick}
    >
      <div className='flex justify-center items-center bg-card bg-center bg-cover sm:w-40 sm:h-40 rounded-xl max-sm:p-4'>
        <img
          src={imgURL.thumbnail}
          alt='shoe colletion'
          width={127}
          height={103.34}
          className='object-contain'
        />
      </div>
    </div>
  );
};

export default ShoeCard;
```

#### index.css

```css
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Palanquin:wght@100;200;300;400;500;600;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Palanquin:wght@100;200;300;400;500;600;700&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

@layer components {
  .max-container {
    max-width: 1440px;
    margin: 0 auto;
  }

  .input {
    @apply sm:flex-1 max-sm:w-full text-base leading-normal text-slate-gray pl-5 max-sm:p-5 outline-none sm:border-none border max-sm:border-slate-gray max-sm:rounded-full;
  }
}

@layer utilities {
  .padding {
    @apply sm:px-16 px-8 sm:py-24 py-12;
  }

  .padding-x {
    @apply sm:px-16 px-8;
  }

  .padding-y {
    @apply sm:py-24 py-12;
  }

  .padding-l {
    @apply sm:pl-16 pl-8;
  }

  .padding-r {
    @apply sm:pr-16 pr-8;
  }

  .padding-t {
    @apply sm:pt-24 pt-12;
  }

  .padding-b {
    @apply sm:pb-24 pb-12;
  }

  .info-text {
    @apply font-montserrat text-slate-gray text-lg leading-7;
  }
}
```

解析

1. 引入 Google Fonts

> 这里导入了两种 Google 字体：Montserrat 和 Palanquin。每种字体都包含了从 100 到 700 的不同字重。

```css
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Palanquin:wght@100;200;300;400;500;600;700&display=swap");  
@import url("https://fonts.googleapis.com/css2?family=Palanquin:wght@100;200;300;400;500;600;700&display=swap");
```

2. 引入 Tailwind 基础、组件和工具类

> 这里引入了 Tailwind CSS 的三个主要层：基础（base）、组件（components）和工具类（utilities）。

- base：包含重置样式和基本的排版规则。
- components：包含一些预设的组件样式，但在这个文件中没有直接使用。
- utilities：包含大量用于快速布局的实用工具类。

```css
@tailwind base;  
@tailwind components;  
@tailwind utilities;
```

3. 全局样式重置

```css
* {  
  margin: 0;  
  padding: 0;  
  box-sizing: border-box;  
  scroll-behavior: smooth;  
}
```

4. 自定义组件样式

> 在 @layer components 中定义了两个自定义组件样式

- .max-container：设置了一个最大宽度，并使其水平居中。
- .input：定义了一个输入框的样式，使用了 @apply 指令来应用多个 Tailwind 工具类。

```css
@layer components {  
  .max-container {  
    max-width: 1440px;  
    margin: 0 auto;  
  }  
  
  .input {  
    @apply sm:flex-1 max-sm:w-full text-base leading-normal text-slate-gray pl-5 max-sm:p-5 outline-none sm:border-none border max-sm:border-slate-gray max-sm:rounded-full;  
  }  
}
```

5. 自定义工具类

> 在 @layer utilities 中定义了一系列自定义工具类，主要用于设置不同的内边距（padding）和一个 .info-text 类用于文本样式。

- .padding、.padding-x、.padding-y 等：用于快速设置元素的内边距。
- .info-text：应用了 Montserrat 字体、灰色文本颜色、较大的字号和行高。

```css
@layer utilities {
  .padding {
    @apply sm:px-16 px-8 sm:py-24 py-12;
  }

  .padding-x {
    @apply sm:px-16 px-8;
  }

  .padding-y {
    @apply sm:py-24 py-12;
  }

  .padding-l {
    @apply sm:pl-16 pl-8;
  }

  .padding-r {
    @apply sm:pr-16 pr-8;
  }

  .padding-t {
    @apply sm:pt-24 pt-12;
  }

  .padding-b {
    @apply sm:pb-24 pb-12;
  }

  .info-text {
    @apply font-montserrat text-slate-gray text-lg leading-7;
  }
}
```

---

谢谢款待

`2024` `1` `31` 
