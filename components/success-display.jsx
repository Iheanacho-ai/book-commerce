const SuccessDisplay = () => {
  const createPortalSession = async () => {
    // try {
    //     await fetch('/api//create-portal-session', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             lookup_key 
    //         })
    //     })
    // } catch (error) {
    //     console.log(error)
    // }

    alert('yeah')
};
    return (
      <section>
        <div className="product Box-root">
          <Logo />
          <div className="description Box-root">
            <h3>Subscription to starter plan successful!</h3>
          </div>
        </div>
        <form onSubmit={createPortalSession} method="POST">
          <input
            type="hidden"
            id="session-id"
            name="session_id"
          />
          <button id="checkout-and-portal-button" type="submit">
            Manage your billing information
          </button>
        </form>
      </section>
    );
};

export default SuccessDisplay;