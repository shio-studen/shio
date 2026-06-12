const categories = [
  { id: 'recommended', name: 'おすすめ', color: '#ffe4ed', border: '#ffbecf', activeColor: '#ffc9d7' },
  { id: 'nigiri', name: '握り', color: '#dbeafe', border: '#a5c1ff', activeColor: '#b7caff' },
  { id: 'gunkan', name: '軍艦巻物', color: '#d1fae5', border: '#8adeb9', activeColor: '#a8f3c7' },
  { id: 'hamakko', name: 'はまっこセット', color: '#fef9c3', border: '#f7e28e', activeColor: '#f8e8a5' },
  { id: 'dessert', name: 'デザートドリンク', color: '#ffedd5', border: '#ffca9b', activeColor: '#ffd7b8' },
  { id: 'noodles', name: '麺汁物サイド', color: '#ede9fe', border: '#bdb5ff', activeColor: '#d5d0ff' },
];

const nigiriItems = [
  { id: 'tuna', name: 'まぐろ', description: '旨みたっぷりの赤身マグロ', price: 121, image: '写真/マグロjpg.jpg' },
  { id: 'salmon', name: 'サーモン', description: 'とろける脂が自慢のサーモン', price: 121, image: '写真/サーモン.jpg' },
  { id: 'ika', name: 'いか', description: 'やわらかな甘みのイカ', price: 121, image: '写真/いか.jpg' },
  { id: 'ebi', name: 'えび', description: 'プリッと食感のエビ', price: 121, image: '写真/えび.jpg' },
  { id: 'tamago', name: 'たまご', description: 'ほんのり甘いふわふわたまご', price: 121, image: '写真/たまご.jpg' },
  { id: 'madai', name: 'まだい', description: '上品な旨みの活〆まだい', price: 121, image: '写真/まだい.jpg' },
  { id: 'tataki', name: 'たたき', description: '滑らかな舌触りのまぐろのたたき軍艦', price: 121, image: '写真/たたき.jpg' },
  { id: 'unagi', name: 'うなぎ', description: '甘辛だれが香る炙りうなぎ', price: 121, image: '写真/うなぎ.jpg' },
  { id: 'akaebi', name: '赤えび', description: '甘みが濃い天然赤えび', price: 121, image: '写真/赤えび.jpg' },
  { id: 'hotate', name: 'ほたて', description: '甘く濃厚なほたて', price: 121, image: '写真/ほたて.jpg' },
  { id: 'ikura', name: 'いくら', description: 'ぷちぷち食感のいくら', price: 121, image: '写真/いくら.jpg' },
];

const dessertItems = [
  { id: 'millefeuille', name: 'ミルフィーユ', description: 'ふわふわな生地とクリームの贅沢デザート', price: 121, image: '写真/ミルフィーユ.jpg' },
];

const state = {
  activeCategory: 'nigiri',
  page: 0,
  cart: [],
  selectedItem: null,
  selectedQuantity: 1,
  modalMode: 'item',
};

const categoryTabs = document.getElementById('categoryTabs');
const menuPanel = document.querySelector('.menu-panel');
const menuGrid = document.getElementById('menuGrid');
const cartItems = document.getElementById('cartItems');
const orderPanel = document.querySelector('.order-panel');
const cartTotal = document.getElementById('cartTotal');
const placeOrderButton = document.getElementById('placeOrder');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const modalOverlay = document.getElementById('itemModal');
const modalBody = document.getElementById('modalBody');
const modalDetails = document.getElementById('modalDetails');
const modalCheckoutContent = document.getElementById('modalCheckoutContent');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const modalImage = document.getElementById('modalImage');
const modalQtyDisplay = document.getElementById('modalQtyDisplay');
const modalQtyDecrease = document.getElementById('modalQtyDecrease');
const modalQtyIncrease = document.getElementById('modalQtyIncrease');
const modalCancelButton = document.getElementById('modalCancel');
const modalOrderButton = document.getElementById('modalOrder');
const thankOverlay = document.getElementById('thankOverlay');

const ITEMS_PER_PAGE = 6;

function formatYen(amount) {
  return `¥${amount.toLocaleString('ja-JP')}`;
}


function renderCategories() {
  categoryTabs.innerHTML = '';
  categories.forEach((category) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'category-button';
    button.textContent = category.name;
    button.style.background = category.color;
    button.style.border = `3px solid ${category.border}`;
    button.style.color = '#1f2937';

    if (state.activeCategory === category.id) {
      button.classList.add('active');
      button.style.background = '#1e3a8a';
      button.style.border = '3px solid #1e3a8a';
      button.style.color = '#ffffff';
    }

    if (category.id === 'recommended' || category.id === 'nigiri' || category.id === 'dessert') {
      button.classList.add('large-text');
    }

    if (category.id === 'nigiri') {
      button.classList.add('nigiri');
    }

    button.addEventListener('click', () => {
      state.activeCategory = category.id;
      state.page = 0;
      renderCategories();
      renderMenu();
    });

    if (category.id !== 'nigiri' && category.id !== 'dessert' && state.activeCategory !== category.id) {
      button.classList.add('disabled');
    }

    categoryTabs.appendChild(button);
  });
}

function getMenuItemsForCategory(categoryId) {
  switch (categoryId) {
    case 'nigiri':
      return nigiriItems;
    case 'dessert':
      return dessertItems;
    default:
      return [];
  }
}

function findMenuItemById(itemId) {
  return nigiriItems.find((item) => item.id === itemId) || dessertItems.find((item) => item.id === itemId);
}

function renderMenu() {
  menuGrid.innerHTML = '';
  if (state.activeCategory !== 'nigiri' && state.activeCategory !== 'dessert') {
    menuPanel.classList.remove('active-nigiri');
    const placeholder = document.createElement('div');
    placeholder.className = 'empty-state';
    placeholder.textContent = '取り扱いなし';
    menuGrid.appendChild(placeholder);
    prevPageButton.disabled = true;
    nextPageButton.disabled = true;
    return;
  }

  menuPanel.classList.add('active-nigiri');
  const items = getMenuItemsForCategory(state.activeCategory);
  const start = state.page * ITEMS_PER_PAGE;
  const pageItems = items.slice(start, start + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(items.length / ITEMS_PER_PAGE);

  pageItems.forEach((item) => {
    const template = document.getElementById('menuItemTemplate');
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.menu-card');
    const image = node.querySelector('.menu-card-image');
    const imgEl = node.querySelector('.menu-img');
    const title = node.querySelector('.menu-title');
    const desc = node.querySelector('.menu-desc');
    const price = node.querySelector('.price');

    title.textContent = item.name;
    desc.textContent = item.description;
    price.textContent = formatYen(item.price);
    if (imgEl) {
      imgEl.src = item.image;
      imgEl.alt = item.name;
    } else {
      image.style.background = `url('${item.image}') center/contain no-repeat`;
    }

    card.addEventListener('click', () => openModal(item));

    menuGrid.appendChild(node);
  });

  for (let i = pageItems.length; i < ITEMS_PER_PAGE; i += 1) {
    const template = document.getElementById('menuItemTemplate');
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.menu-card');
    const image = node.querySelector('.menu-card-image');
    const title = node.querySelector('.menu-title');
    const desc = node.querySelector('.menu-desc');
    const price = node.querySelector('.price');

    card.classList.add('empty-card');
    image.style.background = 'transparent';
    image.style.borderBottom = 'none';
    title.textContent = '';
    desc.textContent = '';
    price.textContent = '';

    menuGrid.appendChild(node);
  }

  prevPageButton.disabled = state.page <= 0;
  nextPageButton.disabled = state.page >= pageCount - 1;
}

function renderCart() {
  cartItems.innerHTML = '<p class="hint">注文内容は合計金額のみ表示されます。</p>';
  const total = state.cart.reduce((sum, entry) => {
    const item = findMenuItemById(entry.itemId);
    return sum + (item ? item.price * entry.qty : 0);
  }, 0);

  cartItems.scrollTop = 0;
  cartTotal.textContent = formatYen(total);
}

function addToCart(itemId, qty = 1) {
  state.cart.unshift({ itemId, qty });
  renderCart();
}

function clearCart() {
  state.cart = [];
  renderCart();
}

function openModal(item) {
  state.modalMode = 'item';
  state.selectedItem = item;
  state.selectedQuantity = 1;
  modalTitle.textContent = item.name;
  modalDesc.textContent = item.description;
  modalPrice.textContent = formatYen(item.price);
  modalQtyDisplay.textContent = state.selectedQuantity;
  modalImage.style.background = `url('${item.image}') center/contain no-repeat`;
  modalImage.style.backgroundSize = 'contain';
  modalImage.style.backgroundPosition = 'center center';
  modalBody.classList.remove('checkout-mode');
  modalCheckoutContent.classList.add('hidden');
  modalDetails.classList.remove('hidden');
  modalImage.classList.remove('hidden');
  modalOrderButton.textContent = '注文';
  modalCancelButton.textContent = '取り消し';
  // move price element next to quantity controls for item modal
  try {
    const qtyGroupEl = document.getElementById('quantityGroup');
    const modalInfoEl = modalDetails.querySelector('.modal-info');
    // create or reuse a wrapper that stacks price above quantity controls
    let qtyWrapper = modalDetails.querySelector('.qty-column');
    if (!qtyWrapper) {
      qtyWrapper = document.createElement('div');
      qtyWrapper.className = 'qty-column';
      // insert after modalInfo
      if (modalInfoEl && modalInfoEl.nextSibling) {
        modalDetails.insertBefore(qtyWrapper, modalInfoEl.nextSibling);
      } else {
        modalDetails.appendChild(qtyWrapper);
      }
    }
    if (qtyWrapper && modalPrice && modalPrice.parentElement !== qtyWrapper) {
      qtyWrapper.appendChild(modalPrice);
    }
    if (qtyGroupEl && qtyGroupEl.parentElement !== qtyWrapper) {
      qtyWrapper.appendChild(qtyGroupEl);
    }
    // mark modal as quantity-mode so CSS can center left/right columns
    if (modalBody && !modalBody.classList.contains('qty-mode')) {
      modalBody.classList.add('qty-mode');
    }
  } catch (e) {
    // ignore
  }

  modalOverlay.classList.remove('hidden');
}

function openCheckoutModal() {
  state.modalMode = 'checkout';
  state.selectedItem = null;
  modalTitle.textContent = 'お会計';
  modalDesc.textContent = '';
  modalPrice.textContent = '';
  modalQtyDisplay.textContent = '';
  modalBody.classList.add('checkout-mode');
  modalCheckoutContent.classList.remove('hidden');
  modalDetails.classList.add('hidden');
  modalImage.classList.add('hidden');
  modalOrderButton.textContent = 'お会計する';
  modalCancelButton.textContent = 'キャンセル';
  // restore price element into modal-info and move quantityGroup back
  try {
    const modalInfoEl = modalDetails.querySelector('.modal-info');
    const qtyGroupEl = document.getElementById('quantityGroup');
    const qtyWrapper = modalDetails.querySelector('.qty-column');
    if (modalInfoEl && modalPrice && modalPrice.parentElement !== modalInfoEl) {
      modalInfoEl.appendChild(modalPrice);
    }
    if (qtyWrapper && qtyGroupEl && qtyGroupEl.parentElement === qtyWrapper) {
      modalDetails.appendChild(qtyGroupEl);
    }
    if (qtyWrapper && qtyWrapper.parentElement) {
      qtyWrapper.remove();
    }
    // ensure qty-mode class removed when switching to checkout
    if (modalBody && modalBody.classList.contains('qty-mode')) {
      modalBody.classList.remove('qty-mode');
    }
  } catch (e) {}

  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
  state.selectedItem = null;
  // move price back to modal-info and restore quantityGroup
  try {
    const modalInfoEl = modalDetails.querySelector('.modal-info');
    const qtyGroupEl = document.getElementById('quantityGroup');
    const qtyWrapper = modalDetails.querySelector('.qty-column');
    if (modalInfoEl && modalPrice && modalPrice.parentElement !== modalInfoEl) {
      modalInfoEl.appendChild(modalPrice);
    }
    if (qtyWrapper && qtyGroupEl && qtyGroupEl.parentElement === qtyWrapper) {
      modalDetails.appendChild(qtyGroupEl);
    }
    if (qtyWrapper && qtyWrapper.parentElement) {
      qtyWrapper.remove();
    }
    if (modalBody && modalBody.classList.contains('qty-mode')) {
      modalBody.classList.remove('qty-mode');
    }
  } catch (e) {
    // ignore
  }
}

function updateModalQuantity(delta) {
  state.selectedQuantity = Math.max(1, state.selectedQuantity + delta);
  modalQtyDisplay.textContent = state.selectedQuantity;
}

modalQtyDecrease.addEventListener('click', () => updateModalQuantity(-1));
modalQtyIncrease.addEventListener('click', () => updateModalQuantity(1));
modalCancelButton.addEventListener('click', closeModal);
modalOrderButton.addEventListener('click', () => {
  if (state.modalMode === 'item') {
    if (!state.selectedItem) return;
    addToCart(state.selectedItem.id, state.selectedQuantity);
    closeModal();
    return;
  }

  if (state.modalMode === 'checkout') {
    completeCheckout();
  }
});

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
    closeModal();
  }
});

function completeCheckout() {
  clearCart();
  closeModal();
  showThankYou();
}

function showThankYou() {
  thankOverlay.classList.remove('hidden');
  setTimeout(() => {
    thankOverlay.classList.add('hidden');
  }, 2800);
}

thankOverlay.addEventListener('click', () => {
  thankOverlay.classList.add('hidden');
});

function placeOrder() {
  if (state.cart.length === 0) {
    alert('注文する商品を選んでください。');
    return;
  }

  const summary = state.cart
    .map((entry) => {
      const item = findMenuItemById(entry.itemId);
      return item ? `${item.name} x${entry.qty}` : '';
    })
    .filter(Boolean)
    .join(', ');

  const total = state.cart.reduce((sum, entry) => {
    const item = findMenuItemById(entry.itemId);
    return sum + (item ? item.price * entry.qty : 0);
  }, 0);

  clearCart();
  alert(`ご注文を承りました！\n\n${summary}\n合計 ${formatYen(total)}`);
}

function handlePagination(direction) {
  const items = getMenuItemsForCategory(state.activeCategory);
  const pageCount = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  state.page = Math.min(Math.max(0, state.page + direction), pageCount - 1);
  renderMenu();
}

prevPageButton.addEventListener('click', () => handlePagination(-1));
nextPageButton.addEventListener('click', () => handlePagination(1));
placeOrderButton.addEventListener('click', openCheckoutModal);

renderCategories();
renderMenu();
renderCart();
