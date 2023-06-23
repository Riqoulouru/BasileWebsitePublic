package basile.newcv.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import basile.newcv.repository.UserRepository;
@RestController
@RequestMapping("/IpAdress")
public class IpAdressController {

    @Autowired
    public UserRepository userRepository;



}
