import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'


export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

   const session = await auth.api.getSession({
      headers: await headers()
     }) 
    const user = session?.user;

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details: { email: customerEmail }
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    const result = await subscription
    console.log(session_id);
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customerEmail}. If you have any questions, please email{' '}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }
}