var productList = [];

// function1: hiển thị sản phẩm cho khách hàng

// small function: lấy dữ liệu về từ db
var fetchData = () => {
  axios({
    url: "https://be-cyber-phone-store.herokuapp.com/api/products",
    method: "GET",
  })
    .then((res) => {
      productList = res.data;
      console.log(productList);
      showProductList();
    })
    .catch((err) => {
      console.log("err", err);
    });
};
fetchData();

// small function: hiển thị sản phẩm lên trang chủ qua dữ liệu từ db
var showProductList = (data) => {
  // Nếu ko có param(!data) => mặc định lấy productList
  if (!data) {
    data = productList;
  }
  var content = "";
  var origin = "";

  for (var i = 0; i < data.length; i++) {
    if (data[i].type === "samsung") {
      origin = "Hàn Quốc";
    } else {
      origin = "Mỹ";
    }
    content += `
    <div class ="product__box col-4" >
      <div class = "product__content">
        <img src="${data[i].img}"/>
        <div>
        <p class="font-weight-bold product__name"> ${data[i].name}</p>
        <p>Thương hiệu: ${data[i].type}</p>
        <p>Đơn giá: ${data[i].price}$</p>
        <p>Mã sản phẩm: ${data[i].id}</p>
        <p>Xuất xứ: ${origin}</p>
        </div>
        <p>Thời gian bảo hành: 24 tháng</p>
        <button class="btn btn-success w-100" onclick = "addToCart('${data[i].id}')" class = "">Thêm vào giỏ hàng</button>
      </div>
    </div>`;
  }

  document.querySelector("#productList").innerHTML = content;
};

// function2: filter sản phẩm theo nhu cầu khách hàng

var filterProduct = () => {
  var iphone = [];
  var samsung = [];

  for (var i = 0; i < productList.length; i++) {
    if (productList[i].type === "iphone") {
      iphone.push(productList[i]);
    } else if (productList[i].type === "samsung") {
      samsung.push(productList[i]);
    }
  }

  var filter = document.querySelector("#typePhone").value;
  if (filter === "allProduct") {
    showProductList();
  } else if (filter === "iphone") {
    showProductList(iphone);
  } else if (filter === "samsung") {
    showProductList(samsung);
  }
};

// function3: làm chức năng giỏ hàng cho người dùng mua sắm

var cart = [];

// small function:show dữ liệu trong giỏ hàng của khách
var renderCart = () => {
  // Trong cart có bao nhiêu phần tử thì tự duyệt mảng và in ra
  var content = "";
  var sumtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var total = cart[i].product.price * cart[i].quantity;
    // function:tính tiền đơn hàng
    sumtotal += total;

    content += `<tr>
    <td style="width: 20%;">
      <img style="height: 150px; width: 200px" src = "${cart[i].product.img}"/>
    </td>
    <td style="width: 30%;">${cart[i].product.name}</td>
    <td style="width: 10%;">${cart[i].product.price + "$"}</td>
    <td style="width: 20%;">${cart[i].quantity}
        <button onclick = "minusQuantity('${
          cart[i].product.id
        }')" class = "btn btn-primary">-</button>
        <button onclick = "plusQuantity('${
          cart[i].product.id
        }')" class = "btn btn-primary">+</button>
    </td>
    <td style="width: 20%;">${total + "$"}
        <button onclick = "removeProductCart('${
          cart[i].product.id
        }')" class = "btn btn-danger">X</button>
    </td>
    </tr>`;
  }
  document.querySelector("#tbodyproduct").innerHTML = content;

  console.log(sumtotal);
  document.querySelector("#total").innerHTML = sumtotal;
};

// function:thêm sản phẩm vào giỏ hàng
var addToCart = (id) => {
  var index = findIndexById(id);
  var cartIndex = cart.findIndex((item) => {
    return item.product.id === id;
  });
  var productBought = { product: productList[index], quantity: 1 };
  console.log(cartIndex);

  if (cartIndex === -1) {
    cart.push(productBought);
    alert("Thêm sản phẩm thành công");
  } else {
    cart[cartIndex].quantity++;
    alert("Thêm sản phẩm thành công");
  }
  console.log(cart);
  renderCart();
  cartAmount();
  saveCart();
};

// small function: tìm index của productList
var findIndexById = (id) => {
  for (var i = 0; i < productList.length; i++) {
    if (productList[i].id === id) {
      return i;
    } else {
    }
  }
  return -1;
};

// function4:cho phép người dùng tăng giảm số lượng hàng
var plusQuantity = (id) => {
  var cartIndex = cart.findIndex((item) => {
    return item.product.id === id;
  });
  if (cartIndex !== -1) {
    cart[cartIndex].quantity++;
  }
  console.log(cartIndex);
  renderCart();
  cartAmount();
  saveCart();
};

var minusQuantity = (id) => {
  var cartIndex = cart.findIndex((item) => {
    return item.product.id === id;
  });

  cart[cartIndex].quantity--;

  if (cart[cartIndex].quantity === 0) {
    cart.splice(cartIndex, 1);
  }

  renderCart();
  cartAmount();
  saveCart();
};

// function5:remove sản phẩm ra khỏi cart

var removeProductCart = (id) => {
  var cartIndex = cart.findIndex((item) => {
    return item.product.id === id;
  });

  cart.splice(cartIndex, 1);

  saveCart();
  cartAmount();
  renderCart();
};

// function5: lưu giỏ hàng vào localStorage

var saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// function:lấy data giỏ hàng đã lưu
var fetchCart = () => {
  var cartJSON = localStorage.getItem("cart");
  if (cartJSON) {
    cart = JSON.parse(cartJSON);
    renderCart();
  }
};
fetchCart();

// function:Thanh toán sản phẩm, clear data trong giỏ hàng

var purchase = () => {
  if (cart.length > 0) {
    cart.splice(0, cart.length);
    alert("Thanh toán thành công, vui lòng kiểm tra thông tin trên hóa đơn");
  } else {
    alert("Thanh toán không thành công, vui lòng kiểm tra giỏ hàng");
  }

  saveCart();
  renderCart();
  cartAmount();
};

// function:Tính tổng số lượng hàng hóa có trong giỏ hàng
var cartAmount = () => {
  var amountProductInCart = 0;

  for (let i = 0; i < cart.length; i++) {
    amountProductInCart += cart[i].quantity;
  }
  document.querySelector("#cartmount").innerHTML = `(${amountProductInCart})`;
  if (amountProductInCart === 0) {
    document.querySelector("#cartmount").innerHTML = "";
  }
};
cartAmount();

// function: tìm kiếm sản phẩm theo id và tên(nếu nhập số id sẽ ra cả sản phẩm có số tìm kiếm trong tên)

var searchProduct = () => {
  var foundProduct = [];
  var keyword = document.querySelector("#search").value;

  for (let i = 0; i < productList.length; i++) {
    if (
      productList[i].id === keyword ||
      productList[i].name.toLowerCase().includes(keyword.toLowerCase())
    ) {
      foundProduct.push(productList[i]);
    }
  }
  console.log(foundProduct);
  showProductList(foundProduct);
};
