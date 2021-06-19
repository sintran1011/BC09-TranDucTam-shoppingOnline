var productList = [];

// function:lấy dữ liệu từ database
var fetchData = () => {
  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
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

var showProductList = (data) => {
  if (!data) {
    data = productList;
  }
  var content = "";

  for (var i = 0; i < data.length; i++) {
    content += `<div class = "product__content col-4">
        <img class = "w-100 h-50" src="${data[i].img}"/>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam mollitia voluptatibus nobis quod id corporis animi repellendus obcaecati aperiam dolore.</p>
        <div class="w-50 m-auto">
        <button onclick = "getInfoProduct('${data[i].id}')" class = "btn btn-info">Get Info</button>
        <button onclick = "deleteProduct('${data[i].id}')" class = "btn btn-warning">Delete</button>
        </div>
    </div>`;
  }

  document.querySelector("#productList").innerHTML = content;
};

// function:filter sản phẩm
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

// function: thêm sản phẩm vào database
var addProduct = () => {
  if(!validateInfo()){
    return;
  }
  var id = document.querySelector("#id").value;
  var name = document.querySelector("#name").value;
  var price = document.querySelector("#price").value;
  var screen = document.querySelector("#screen").value;
  var backCamera = document.querySelector("#backCamera").value;
  var frontCamera = document.querySelector("#frontCamera").value;
  var desc = document.querySelector("#desc").value;
  var type = document.querySelector("#type").value;
  var img = document.querySelector("#img").value;

  var newProduct = new Product(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    desc,
    type,
    img
  );
  console.log(newProduct);

  axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products",
    method: "POST",
    data: newProduct,
  })
    .then((res) => {
      console.log(res);
      fetchData();
      alert("Thêm sản phẩm thành công");
    })
    .catch((err) => {
      console.log("err", err);
    });
};
// function: lấy thông tin sản phẩm từ kệ hàng

var getInfoProduct = (id) => {
  axios({
    url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
    method: "GET",
    params: {
      id: id,
    },
  })
    .then((res) => {
      console.log(res.data);
      document.querySelector("#id").value = res.data.id;
      document.querySelector("#name").value = res.data.name;
      document.querySelector("#price").value = res.data.price;
      document.querySelector("#screen").value = res.data.screen;
      document.querySelector("#backCamera").value = res.data.backCamera;
      document.querySelector("#frontCamera").value = res.data.frontCamera;
      document.querySelector("#desc").value = res.data.desc;
      document.querySelector("#type").value = res.data.type;
      document.querySelector("#img").value = res.data.img;
    })
    .catch((err) => {
      console.log("err", err);
    });
};

// function: cập nhật thông tin sản phẩm vào database
var updateProduct = (id) => {
  var id = document.querySelector("#id").value;
  var name = document.querySelector("#name").value;
  var price = document.querySelector("#price").value;
  var screen = document.querySelector("#screen").value;
  var backCamera = document.querySelector("#backCamera").value;
  var frontCamera = document.querySelector("#frontCamera").value;
  var img = document.querySelector("#img").value;
  var desc = document.querySelector("#desc").value;
  var id = document.querySelector("#id").value;

  var updateProduct = new Product(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    desc,
    type,
    img
  );

  axios({
    url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
    method: "PUT",
    params: {
      id: id,
    },
    data: updateProduct,
  })
    .then((res) => {
      console.log(res);
      alert("Cập nhật dữ liệu sản phẩm thành công");
      fetchData();
    })
    .catch((err) => {
      console.log("err", err);
    });
};

// function:xóa sản phẩm ra khỏi database
var deleteProduct = (id) => {
  axios({
    url: `https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/products/${id}`,
    method: "DELETE",
    params: {
      id: id,
    },
  })
    .then((res) => {
      console.log(res);
      fetchData();
    })
    .catch((err) => {
      console.log("err", err);
    });
};

// function: validate thông tin

var validateInfo = () => {
  var id = document.querySelector("#id").value;
  var name = document.querySelector("#name").value;
  var price = document.querySelector("#price").value;
  var screen = document.querySelector("#screen").value;
  var backCamera = document.querySelector("#backCamera").value;
  var frontCamera = document.querySelector("#frontCamera").value;
  var img = document.querySelector("#img").value;
  var desc = document.querySelector("#desc").value;
  var type = document.querySelector("#type").value;

  var isValid = true;
  isValid &= checkRequired(id, "#idError");
  isValid &= checkRequired(name, "#nameError");
  isValid &= checkRequired(price, "#priceError") && checkNum(price, "#priceError");
  isValid &= checkRequired(screen, "#screenError");
  isValid &= checkRequired(backCamera, "#BackCameraError");
  isValid &= checkRequired(frontCamera, "#frontCameraError");
  isValid &= checkRequired(desc, "#descError");
  isValid &= checkRequired(type, "#typeError") && checkType(type, "#typeError");
  isValid &= checkRequired(img, "#imgError");

  return isValid;
};
var checkRequired = (value, errorId) => {
  if (value.length > 0) {
    document.querySelector(errorId).innerHTML = "";
    return true;
  }
  document.querySelector(errorId).innerHTML = "*  Bắt buộc nhập";
  return false;
};

var checkType = (value, errorId) => {
  if (value === "samsung" || value === "iphone") {
    document.querySelector(errorId).innerHTML = "";
    return true;
  }
  document.querySelector(errorId).innerHTML = "samsung hoặc iphone dùm cái";
};

var checkNum = (value, errorId) => {
  pattern = /[^\d+$]/g;
  if (!pattern.test(value)) {
    document.querySelector(errorId).innerHTML = "";
    return true;
  }
  document.querySelector(errorId).innerHTML = "nhập số only nhá";
  return false;
};
