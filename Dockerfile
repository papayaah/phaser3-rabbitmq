FROM rabbitmq:3.7-management
RUN rabbitmq-plugins enable --offline rabbitmq_mqtt rabbitmq_federation_management rabbitmq_stomp rabbitmq_web_stomp_examples

EXPOSE 15670 15671 15672 15674 61613
