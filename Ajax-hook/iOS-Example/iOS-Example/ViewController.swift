//
//  ViewController.swift
//  iOS-Example
//
//  Created by YZF on 2019/3/22.
//  Copyright © 2019 Xiaoye. All rights reserved.
//

import UIKit
import WebKit
import JustBridge

let topHeight = UIApplication.shared.statusBarFrame.height + 44
let screenHeight = UIScreen.main.bounds.height
let screenWidth = UIScreen.main.bounds.width

class ViewController: UIViewController {

    var webView: WKWebView!
    var bridge: JustBridge!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        webView = WKWebView(frame: CGRect(x: 0, y: topHeight, width: screenWidth, height: screenHeight - topHeight))
        webView.scrollView.isScrollEnabled = false
        view.addSubview(webView)
        
        bridge = JustBridge(with: webView)
        
        // 注入 ajaxhook.js
        let ajaxhook_js = try! String(contentsOfFile: Bundle.main.path(forResource: "ajaxhook", ofType: "js")!)
        let script = WKUserScript(source: ajaxhook_js, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        webView.configuration.userContentController.addUserScript(script)
        
        bridge.register("xhrPOST") { (data, callback) in
            print("[js call swift] - data: \(data ?? "nil")\n")
            self.handleXHRPOST(data: data)
        }
        
        let htmlString = try! String(contentsOfFile: Bundle.main.path(forResource: "index", ofType: "html")!)
        webView.loadHTMLString(htmlString, baseURL: nil)
    }

    func handleXHRPOST(data: Any?) {
        guard let dict = data as? [String: Any] else {
            return
        }
        var response = [String: Any]()
        response["xhrId"] = dict["xhrId"]
        response["statusCode"] = 200
        response["responseText"] = "lalala"
        response["responseHeaders"] = ["header": "myHeader"]

        bridge.call("xhrCallback", data: response)
    }

}

