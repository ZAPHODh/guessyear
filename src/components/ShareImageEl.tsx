export const ShareImageEl = ({
    siteName,
    locale,
    attempts,
    won,
    correctYear,
}: {
    siteName: string;
    locale: string;
    attempts: string;
    won: boolean;
    correctYear: string;
}) => {
    const statsText = [attempts && `${attempts} attempt${parseInt(attempts) === 1 ? '' : 's'}`, correctYear && `Year: ${correctYear}`].filter(Boolean).join(' • ');

    return (
        <div
            style={{
                background: won
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'system-ui',
                color: 'white',
                position: 'relative',
            }}
        >
            <div
                style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '20px',
                    opacity: 0.9,
                    display: 'flex',
                }}
            >
                {siteName}
            </div>

            <div
                style={{
                    fontSize: '64px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    marginBottom: '30px',
                    display: 'flex',
                }}
            >
                {won ? 'I Won!' : 'I Lost!'}
            </div>

            {statsText && (
                <div
                    style={{
                        fontSize: '36px',
                        textAlign: 'center',
                        marginBottom: '40px',
                        display: 'flex',
                    }}
                >
                    {statsText}
                </div>
            )}

            <div
                style={{
                    fontSize: '28px',
                    opacity: 0.9,
                    textAlign: 'center',
                    display: 'flex',
                }}
            >
                Play the Daily Photo Challenge!
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: '40px',
                    right: '40px',
                    fontSize: '48px',
                    display: 'flex',
                }}
            >
                {won ? '🎉' : '📸'}
            </div>

            <div
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    right: '40px',
                    fontSize: '18px',
                    opacity: 0.7,
                    display: 'flex',
                }}
            >
                /{locale}
            </div>
        </div>
    );
};