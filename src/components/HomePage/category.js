import React from 'react';
import './category.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Keyboard } from 'swiper/modules';

const categorys = [
    { id: 1, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtPT8IrvRI__9asIKIflxgLvosl0o61cNQnA&s', topic: 'Trinh thám' },
    { id: 2, image: 'https://product.hstatic.net/200000343865/product/truyen-kinh-di-viet-nam---truyen-duong-rung_9ca9fb63402647fb9a510bb52f5f463e_master.jpg', topic: 'Kinh dị' },
    { id: 3, image: 'https://gcs.tripi.vn/public-tripi/tripi-feed/img/473804zci/tat-den-ngo-tat-to-140151.jpg', topic: 'Văn học' },
    { id: 4, image: 'https://product.hstatic.net/1000217031/product/cach_hoc_10_ngoai_ngu_in-01_6f8aa353759542748bdf2af4fedca9c3.jpg', topic: 'Ngoại ngữ'},
    { id: 5, image: 'https://product.hstatic.net/1000217031/product/cach_hoc_10_ngoai_ngu_in-01_6f8aa353759542748bdf2af4fedca9c3.jpg', topic: 'Ngoại ngữ'},
    { id: 6, image: 'https://product.hstatic.net/1000217031/product/cach_hoc_10_ngoai_ngu_in-01_6f8aa353759542748bdf2af4fedca9c3.jpg', topic: 'Ngoại ngữ'},
    { id: 7, image: 'https://product.hstatic.net/1000217031/product/cach_hoc_10_ngoai_ngu_in-01_6f8aa353759542748bdf2af4fedca9c3.jpg', topic: 'Ngoại ngữ'},
    { id: 8, image: 'https://product.hstatic.net/1000217031/product/cach_hoc_10_ngoai_ngu_in-01_6f8aa353759542748bdf2af4fedca9c3.jpg', topic: 'Ngoại ngữ'},
];


function Category() {
    return (
        <div className="category-list">
            <h2 className='categorys-title'>Thể loại</h2>
            <h3 className='categorys-quiz'>"Một cuốn sách hay cho ta một điều tốt, một người bạn tốt cho ta một điều hay."</h3>
            <h4>– La Rochefoucauld</h4>
            <div className='category-content'>
                <Swiper
                    mousewheel={true}
                    keyboard={true}
                    spaceBetween={45}
                    slidesPerView={4}
                    modules={[Mousewheel, Keyboard]}
                >
                    {categorys.map((category) => (
                        <SwiperSlide className='category-item' key={category.id}>
                            <img src={category.image}/>
                            <strong>{category.topic}</strong> 
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default Category;
