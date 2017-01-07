var <%= modelNameUCase %> = require('../models/<%= modelName%>');

module.exports = function(router) {

	router.route('/<%= modelPluralLCase %>')
        .get(function(req, res) {
            <%= modelNameUCase %>.find({}, function(err, items) {
                if (err)
                    return res.status(500).send(err);
                    
                res.status(200).json(items);
            });
        })
        
        .post(function(req, res) {
            var <%= modelNameLCase %> = new <%= modelNameUCase%>();
           
           	// Add Fields here
           	// department.name = req.body.name
           	// department.active = req.body.active
            
            <%= modelNameUCase%>.findOne({name: <%= modelNameLCase%>.name}, function(err, data){
                if (err)
                    return res.status(500).send(err);
                
                if (data) {
                    res.status(409).json({message: 'Name Already Exists'});
                } else {
                    <%= modelNameLCase%>.save(function(err) {
                        if (err)
                            return res.status(500).send(err);

                        var clean<%= modelNameUCase%> = <%= modelNameLCase%>.toObject();
                        delete clean<%= modelNameUCase%>['deleted'];

                        res.status(200).json(clean<%= modelNameUCase%>);
                    });
                }
            });
        })
    ;
    
    router.route('/<%= modelPluralLCase %>/:id')
        .get(function(req, res) {
            <%= modelNameUCase %>.findById(req.params.id)
                .exec(function(err, item) {
                    if (err)
                        return res.status(500).send(err);
                        
                    res.status(200).json(item);
                });
        })
        
        .put(function(req, res) {
            <%= modelNameUCase %>.findById(req.params.id, function(err, item) {
                if (err)
                    return res.status(500).send(err);
                    
                /* Add your field updates here */
                item.name = req.body.name;
                item.active = req.body.active;
                    
                item.save(function(err) {
                    if(err)
                        return res.status(500).send(err);
                        
                    res.status(200).json(item);
                });
            });
        })
        
        .delete(function(req, res) {

            // Employee.findOne({"contactInformation.type": req.params.id}, function(err, employee) {
            //     if (err)
            //         return res.send(err);

            //     if (employee) {
            //         res.status(409).json("EMP_ASSIGNED_EXISTS")
            //     } else {
                    <%= modelNameLCase %>.remove({
                        _id: req.params.id
                    }, function(err, item) {
                        if (err)
                            return res.status(500).send(err);
                            
                        res.status(200).json(item);
                    });
                // }
            // });

        })
    ;
       
}