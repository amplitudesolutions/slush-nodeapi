process.env.NODE_ENV = "test";

var chai = require("chai");
var chaiHttp = require("chai-http");

var <%= modelNameUCase%> = require("../app/models/<%= modelNameLCase%>");

var server = require("../server");

var should = chai.should();

var added<%= modelNameUCase%>;

chai.use(chaiHttp);

describe("<%= modelNameUCase %>", function() {
    
    <%=modelNameUCase%>.collection.drop();
    
    beforeEach(function(done) {
        // ADD FIELDS FOR THE MODEL TO ADD {FIELD_NAME: FIELD_VALUE}
        var new<%=modelNameUCase%> = {};

        chai.request(server)
            .post("/api/<%= modelPluralLCase %>")
            .send(new<%=modelNameUCase%>)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.should.be.a("object");
                res.body.should.have.property("_id");
                // ADD CHECKS TO ENSURE THE DATA YOU WANT IS RETURNED
                // res.body.should.have.property("FIELD_NAME");
                // res.body.FIELD_NAME.should.equal("FIELD_VALUE");
                added<%= modelNameUCase%> = res.body;
                done();              
            });
    });
    
    afterEach(function(done) {
        <%=modelNameUCase%>.collection.drop();
        done();
    });
    
    it("Should add a new <%= modelNameUCase %>", function(done) {
        // ADD FIELDS FOR THE MODEL TO ADD {FIELD_NAME: FIELD_VALUE}
        var new<%=modelNameUCase%> = {};

        chai.request(server)
            .post("/api/<%=modelPluralLCase%>")
            .send(new<%=modelNameUCase%>)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.should.be.a("object");
                res.body.should.have.property("_id");

                // ADD CHECKS TO ENSURE THE DATA YOU WANT IS RETURNED
                // res.body.should.have.property("FIELD_NAME");
                // res.body.FIELD_NAME.should.equal("FIELD_VALUE");
                res.body.should.not.have.property("deleted");
                done();              
            });
    });
    
    it("Should get a listing of all <%= modelNameUCase %>", function(done) {
        chai.request(server)
            .get("/api/<%=modelPluralLCase%>")
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("array");
                res.body.length.should.equal(1);
                res.body[0].should.have.property("_id");
                // ADD CHECKS TO ENSURE THE DATA YOU WANT IS RETURNED
                // res.body[0].should.have.property("FIELD_NAME");
                // res.body[0].FIELD_NAME.should.equal("FIELD_VALUE");
                res.body[0].should.not.have.property("deleted");
                done();
            });
    });
    
    it("Should get a single <%= modelNameUCase %>", function(done) {
        chai.request(server)
            .get("/api/<%=modelPluralLCase%>/" + added<%= modelNameUCase %>._id)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.json;
                res.should.be.a("object");
                res.body.should.have.property("_id");
                res.body._id.should.equal(added<%= modelNameUCase %>._id.toString());
                // ADD CHECKS TO ENSURE THE DATA YOU WANT IS RETURNED
                // res.body.should.have.property("FIELD_NAME");
                // res.body.FIELD_NAME.should.equal("FIELD_VALUE");
                res.body.should.not.have.property("deleted");
                done();
            });
    });
    
    it("Should update a single <%= modelNameUCase %>", function(done) {
        chai.request(server)
            .put("/api/<%=modelPluralLCase%>/" + added<%= modelNameUCase %>._id)
            // INSERT FIELDS TO UPDATE {description: test, active: false}
            .send({})
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.json;
                res.should.be.a("object");
                // ADD CHECKS TO ENSURE THE DATA YOU WANT IS RETURNED
                // res.body.should.have.property("FIELD_NAME");
                // res.body.FIELD_NAME.should.equal("FIELD_VALUE");
                res.body.should.not.have.property("deleted");
                done();
            });
    });

    it("Should delete a <%= modelNameUCase %>", function(done) {
        chai.request(server)
            .delete("/api/<%=modelPluralLCase%>/" + added<%= modelNameUCase %>._id)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.json;
                res.should.be.a("object");
                
                chai.request(server)
                    .get("/api/<%=modelPluralLCase%>")
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.should.json;
                        res.body.should.be.a("array");
                        res.body.length.should.equal(0);
                        done();        
                    })
            });
    });
    
});