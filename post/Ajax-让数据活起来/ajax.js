let ajax = function (url, method, data, fn) {
    let xml = new XMLHttpRequest();
    // 判断 
    if (method == 'get') {
        xml.open(method, url + '?' + data, true);
    } else if (method == 'post') {
        xml.open(method, url, true);
        xml.setRequestHeader('Content-tepe', 'application/x-www-form-urlencoded');
        xml.send('name=gd&age=18&sex=boy');
    }
    // 获取响应数据
    xml.onreadystatechange = function () {
        if (xml.readyState == 4) {
            if (xml.status == 200 || xml.status == 304) {
                // 让外界能够拿到响应数据 使用回调函数来实现
                // 如果响应数据成功 就调传用入的回调函数 fn
                fn(xhr.responseText)
            }
        }
    }
}