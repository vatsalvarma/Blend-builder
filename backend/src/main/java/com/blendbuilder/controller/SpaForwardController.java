package com.blendbuilder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping({
        "/admin",
        "/admin/**",
        "/feedback/**",
        "/privacy"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
