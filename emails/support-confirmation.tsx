import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

interface SupportConfirmationTemplateProps {
    userName: string;
    subject: string;
}

const SupportConfirmationTemp: React.FC<Readonly<SupportConfirmationTemplateProps>> = ({
    userName,
    subject,
}) => {
    return (
        <Html>
            <Head />
            <Preview>We received your support request: {subject}</Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container className="mx-auto my-10 bg-white">
                        <Section className="m-6">
                            <Text className="mx-10 text-lg font-bold">
                                Hi {userName},
                            </Text>
                            <Text className="mx-10 text-base">
                                Thank you for contacting our support team. We have received your message regarding:
                            </Text>
                            <Section className="mx-10 my-4 p-4 bg-gray-50 border-l-4 border-blue-500">
                                <Text className="text-base font-semibold text-gray-800">
                                    {subject}
                                </Text>
                            </Section>
                            <Text className="mx-10 text-base">
                                Our team will review your request and get back to you as soon as possible. 
                                We typically respond within 24 hours during business days.
                            </Text>
                            <Text className="mx-10 text-base">
                                If your issue is urgent, please don't hesitate to send us a follow-up message 
                                with additional details.
                            </Text>
                            <Text className="mx-10 text-base font-light">
                                Best regards,
                            </Text>
                            <Text className="mx-10 text-base font-bold">
                                The Guess Support Team
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default SupportConfirmationTemp;