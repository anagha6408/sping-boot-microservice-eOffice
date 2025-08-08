package com.anagha.staffclientservice.welcome;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/eOffice")
public class WelcomeController {
	
	@GetMapping("/welcome")
	public ResponseEntity<String> WelcomeMessage(){
		return new ResponseEntity<>(" Welcome to the page",HttpStatus.OK);
	}

}
