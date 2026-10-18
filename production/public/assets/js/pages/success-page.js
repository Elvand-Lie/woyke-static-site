import { escapeHtml, formatCurrency, formatDate, getQuery } from '../app/utils.js';
import { orderRepository } from '../repositories/repositories.js';

const root=document.querySelector('#success-content');
if(root){
  const value=getQuery('order') || sessionStorage.getItem('woyke.lastOrder') || '';
  const order=orderRepository.get(value);
  if(!order){root.innerHTML=`<div class="success-copy"><span class="section-kicker">Demo confirmation</span><h1>No order<br>to show.</h1><p>This confirmation link is missing or its local browser record is unavailable. Your bag and previous local orders have not been changed.</p><div class="btn-row"><a class="btn btn-light" href="/cart/"><span>Open bag</span></a><a class="text-link" href="/account/orders/">View demo orders</a></div></div>`;}
  else {root.innerHTML=`<div class="success-copy"><span class="section-kicker">Demo order / ${escapeHtml(order.reference)}</span><h1>Your piece<br>has begun.</h1><p>One local demonstration order was created on ${escapeHtml(formatDate(order.createdAt))}. No payment was charged and no workshop, email or delivery service was contacted.</p><div class="success-order-recap"><span>${order.lines.length} ${order.lines.length===1?'piece':'pieces'}</span><strong>${formatCurrency(order.totals.total)}</strong></div><div class="btn-row"><a class="btn btn-light" href="/account/orders/"><span>View order history</span><span>+</span></a><a class="text-link" href="/shop/">Continue exploring</a></div></div>`;}
}