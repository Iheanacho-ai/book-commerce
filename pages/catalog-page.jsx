import {useState} from 'react';
import ProductPage from "../components/product-widget";
import { useRouter } from 'next/router';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const CatalogPage = ({sessionid}) => {
    console.log('session id catalog page', sessionid)
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [widgetProduct, setWidgetProduct] = useState()
    const [searchName, setSearchName] = useState()
    const [filteredBooksArray, setFilteredBooksArray] = useState()

    
    const newBookArray = (e) => {
        if(e.key === 'Enter'){
            if(searchName.length > 0){
                const smallSearchName = searchName.toLowerCase()
               const filteredBooks =  products.filter(item=> item.name.toLocaleLowerCase() === smallSearchName)
               setFilteredBooksArray(filteredBooks)
               router.push(`#${searchName}`);


            }else{
                return products;
            }
        }
    } 

    const openProductPage =(e) => {
        setOpen(true)
        const id = e.currentTarget.id
        const filteredObject = products.filter(product => product.id == id)
        setWidgetProduct(filteredObject);

    }

    const products = [
        {
          id: 1,
          name: 'Earthen Bottle',
          price: 48,
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
          imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
        },
        {
          id: 2,
          name: 'Nomad Tumbler',
          price: 35,
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
          imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
        },
        {
          id: 3,
          name: 'Focus Paper Refill',
          price: 89,
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
          imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
          reviewCount: 4
        },
        {
          id: 4,
          name: 'Machined Mechanical Pencil',
          price: 35,
          imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
          imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
          reviewCount: 3
        },  
        // More products...
    ]
    return(
        <div className="catalog-page">
            <div className="bg-white">
                <div className="mx-auto max-w-2xl py-16 px-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Products</h2>

                    <div className='max-w-md mx-auto mb-10'>
                        <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
                            <div className="grid place-items-center h-full w-12 text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <input
                            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                            type="text"
                            id="search"
                            value={searchName}
                            onChange= {(e)=> setSearchName(e.target.value)}
                            onKeyDown={newBookArray}
                            placeholder="Search for books.." /> 
                        </div>
                    </div>

                    {
                        filteredBooksArray ? (
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {
                                    filteredBooksArray.map((book) => (
                                        <a key={book.id} id={book.id} href={`#${book.name}`} onClick={openProductPage} sessionid={sessionid} className="group">\
                                            <ProductPage widgetProduct= {widgetProduct} open= {open} setOpen= {setOpen}/>
                                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                                                <img
                                                    src={book.imageSrc}
                                                    alt={book.imageAlt}
                                                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                                                />
                                            </div>
                                            <h3 className="mt-4 text-sm text-gray-700">{book.name}</h3>
                                            <p className="mt-1 text-lg font-medium text-gray-900">${book.price}</p>
                                        </a>
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                {products.map((product) => (
                                    <a key={product.id} id={product.id} href={`#${product.name}`} onClick={openProductPage} className="group">
                                        <ProductPage widgetProduct= {widgetProduct} open= {open} setOpen= {setOpen} sessionid={sessionid}/>
                                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                                            <img
                                                src={product.imageSrc}
                                                alt={product.imageAlt}
                                                className="h-full w-full object-cover object-center group-hover:opacity-75"
                                            />
                                        </div>
                                        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                        <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
                                    </a>
                                ))}
                            </div>

                        )
                    }

                    
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async (ctx) => {
    // Create authenticated Supabase Client
    const supabase = createServerSupabaseClient(ctx)
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log(session.user.id)
    // collect the subscription of a user 
  
    if (!session)
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
    }
  
    return {
      props: {
        sessionid: session.user.id,
      },
    }
}

export default CatalogPage;

