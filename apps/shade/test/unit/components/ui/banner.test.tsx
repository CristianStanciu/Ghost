import assert from 'assert/strict';
import {describe, it, vi} from 'vitest';
import {fireEvent, screen} from '@testing-library/react';
import {Banner} from '../../../../src/components/ui/banner';
import {render} from '../../utils/test-utils';

describe('Banner Component', () => {
    it('renders children correctly', () => {
        render(<Banner>Test content</Banner>);
        const content = screen.getByText('Test content');

        assert.ok(content, 'Banner should render children');
    });

    it('applies default variant and size classes', () => {
        render(<Banner>Content</Banner>);
        const banner = screen.getByRole('status');

        assert.ok(banner, 'Banner should be rendered with default role');
        assert.ok(banner.className.includes('bg-background'), 'Should have default variant class');
    });

    it('applies gradient variant correctly', () => {
        render(<Banner variant="gradient">Content</Banner>);
        const banner = screen.getByRole('status');

        assert.ok(banner.className.includes('bg-white'), 'Should have gradient variant class');
        assert.ok(banner.className.includes('cursor-pointer'), 'Gradient variant should be clickable');
    });

    it('applies info variant correctly', () => {
        render(<Banner variant="info">Content</Banner>);
        const banner = screen.getByRole('status');

        assert.ok(banner.className.includes('bg-blue-50'), 'Should have info variant class');
    });

    it('applies success variant correctly', () => {
        render(<Banner variant="success">Content</Banner>);
        const banner = screen.getByRole('status');

        assert.ok(banner.className.includes('bg-green-50'), 'Should have success variant class');
    });

    it('applies warning variant correctly', () => {
        render(<Banner variant="warning">Content</Banner>);
        const banner = screen.getByRole('status');

        assert.ok(banner.className.includes('bg-yellow-50'), 'Should have warning variant class');
    });

    it('applies destructive variant correctly', () => {
        render(<Banner variant="destructive">Content</Banner>);
        const banner = screen.getByRole('status');

        assert.ok(banner.className.includes('bg-red-50'), 'Should have destructive variant class');
    });

    it('applies small size correctly', () => {
        render(<Banner size="sm">Content</Banner>);
        const banner = screen.getByRole('status');

        assert.ok(banner.className.includes('p-2'), 'Should have small size class');
    });

    it('applies large size correctly', () => {
        render(<Banner size="lg">Content</Banner>);
        const banner = screen.getByRole('status');

        assert.ok(banner.className.includes('p-4'), 'Should have large size class');
    });

    it('applies correct ARIA attributes by default', () => {
        render(<Banner>Content</Banner>);
        const banner = screen.getByRole('status');

        assert.equal(banner.getAttribute('role'), 'status', 'Should have status role');
        assert.equal(banner.getAttribute('aria-live'), 'polite', 'Should have polite aria-live');
    });

    it('applies custom ARIA attributes', () => {
        render(
            <Banner
                bannerRole="alert"
                ariaLive="assertive"
                ariaLabel="Test banner"
            >
                Content
            </Banner>
        );

        const banner = screen.getByRole('alert');
        assert.equal(banner.getAttribute('role'), 'alert', 'Should have alert role');
        assert.equal(banner.getAttribute('aria-live'), 'assertive', 'Should have assertive aria-live');
        assert.equal(banner.getAttribute('aria-label'), 'Test banner', 'Should have custom aria-label');
    });

    it('shows dismiss button when dismissible', () => {
        render(<Banner dismissible>Content</Banner>);
        const dismissButton = screen.getByLabelText('Dismiss notification');

        assert.ok(dismissButton, 'Dismiss button should be rendered');
    });

    it('does not show dismiss button when not dismissible', () => {
        render(<Banner>Content</Banner>);
        const dismissButton = screen.queryByLabelText('Dismiss notification');

        assert.equal(dismissButton, null, 'Dismiss button should not be rendered');
    });

    it('calls onDismiss when close button clicked', () => {
        const onDismiss = vi.fn();
        render(<Banner dismissible onDismiss={onDismiss}>Content</Banner>);

        const dismissButton = screen.getByLabelText('Dismiss notification');
        fireEvent.click(dismissButton);

        assert.equal(onDismiss.mock.calls.length, 1, 'onDismiss should be called once');
    });

    it('removes banner after dismissal', () => {
        render(<Banner dismissible>Content</Banner>);

        const dismissButton = screen.getByLabelText('Dismiss notification');
        fireEvent.click(dismissButton);

        const content = screen.queryByText('Content');
        assert.equal(content, null, 'Banner should be removed after dismissal');
    });

    it('prevents propagation on dismiss click', () => {
        const parentClick = vi.fn();
        render(
            <div onClick={parentClick}>
                <Banner dismissible>Content</Banner>
            </div>
        );

        const dismissButton = screen.getByLabelText('Dismiss notification');
        fireEvent.click(dismissButton);

        assert.equal(parentClick.mock.calls.length, 0, 'Parent click handler should not be called');
    });

    it('allows parent click handler when clicking banner content', () => {
        const bannerClick = vi.fn();
        render(<Banner onClick={bannerClick}>Content</Banner>);

        const banner = screen.getByRole('status');
        fireEvent.click(banner);

        assert.equal(bannerClick.mock.calls.length, 1, 'Banner click handler should be called');
    });

    it('applies custom className', () => {
        render(<Banner className="custom-class">Content</Banner>);
        const banner = screen.getByRole('status');

        assert.ok(banner.className.includes('custom-class'), 'Should apply custom className');
    });

    it('forwards ref correctly', () => {
        const ref = {current: null};
        render(<Banner ref={ref as any}>Content</Banner>);

        assert.ok(ref.current, 'Ref should be forwarded');
    });

    it('renders with region role when specified', () => {
        render(<Banner bannerRole="region" ariaLabel="Important region">Content</Banner>);
        const banner = screen.getByRole('region');

        assert.ok(banner, 'Banner should render with region role');
        assert.equal(banner.getAttribute('aria-label'), 'Important region', 'Should have aria-label for region');
    });

    it('supports all HTML div attributes', () => {
        render(
            <Banner
                data-testid="test-banner"
                id="banner-id"
                style={{marginTop: '10px'}}
            >
                Content
            </Banner>
        );

        const banner = screen.getByRole('status');
        assert.equal(banner.getAttribute('data-testid'), 'test-banner', 'Should support data attributes');
        assert.equal(banner.getAttribute('id'), 'banner-id', 'Should support id attribute');
        assert.ok(banner.style.marginTop, 'Should support style attribute');
    });
});
