import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Counter from './counter'
import { useRouter } from 'next/router'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'


const ProductPage = ({ widgetProduct, open, setOpen, sessionid}) => {
  const router = useRouter()
  const [counter, setCounter] = useState(0)
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  const backToCatalogPage = () => {
    setOpen(false);
    router.push('/catalog-page');
  }

  const addBookToBag = async () => {
    if (widgetProduct) {
      // checks if the quantity of the wishlist item is greater than zero

      if (counter > 0) {
        const { name, price, imageSrc, imageAlt, id } = widgetProduct[0]
        // create a special id for each product and user
        const uniqueId =`${sessionid}-${id}`
        

        if(user){
          console.log(user)
          //check if the object exists already on our database using the ID
          const { data, error } = await supabaseClient
            .from('cart_items')
            .select()
            .eq('id', id)

  
            if (data && data.length > 0) {
              // if data exists get its quantity and add it to new quantity
              const newQuantity = data[0].quantity + counter
  
              //update the cart item on the database
  
              const { error } = await supabaseClient
                .from('cart_items')
                .update({ quantity: newQuantity })
                .eq('id', id)
  
                if (error) {
                  // console any error we encounter along the way
                  console.log(error)
                  alert('Error adding the item to your wishlist')
                } else {
                  // alert that we have added to our wishlist successfully
    
                  alert('item added successfully to wishlist')
                }
  
            } else {
              // add a new item if the item is not available on our database
              const { error } = await supabaseClient
                .from('cart_items')
                .insert(
                  {
                    id: id,
                    name,
                    price,
                    image_src: imageSrc,
                    image_alt: imageAlt,
                    quantity: counter,
                    item_id: uniqueId
                  }
                )
  
              if (error) {
                // console any error encountered
  
                console.log(error)
                alert('Error adding the item to your wishlist, 2nd part')
              } else {
                alert('item added to Wishlist')
              }
  
            }
          if(error){
            console.log(error, 'error checking if the cart item data exists already')
          }

        }

      } else {
        alert("Quantity must be greater than 0")
      }

    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                    onClick={backToCatalogPage}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {
                    widgetProduct ? (
                      <div className="grid w-full grid-cols-1 items-start gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8">
                        <div className="aspect-w-2 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                          <img src={widgetProduct[0].imageSrc} alt={widgetProduct[0].imageAlt} className="object-cover object-center" />
                        </div>
                        <div className="sm:col-span-8 lg:col-span-7">
                          <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{widgetProduct[0].name}</h2>

                          <section aria-labelledby="information-heading" className="mt-2">
                            <h3 id="information-heading" className="sr-only">
                              Product information
                            </h3>

                            <p className="text-m font-mono text-gray-900 mb-5">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo voluptatibus nesciunt dolores tenetur, alias ullam porro et mollitia autem quis corporis eligendi, nulla minima vitae? Atque, sequi? Delectus, itaque id.
                            </p>

                            <p className="text-2xl text-gray-900">${widgetProduct[0].price}</p>
                          </section>

                          <section aria-labelledby="options-heading" className="mt-5">
                            <h3 id="options-heading" className="sr-only">
                              Product Quantity
                            </h3>

                            <Counter counter={counter} setCounter={setCounter} />

                            <form>
                              <button
                                type="button"
                                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={addBookToBag}
                              >
                                Add to Bag
                              </button>
                            </form>
                          </section>
                        </div>
                      </div>
                    ) : null
                  }
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ProductPage;


